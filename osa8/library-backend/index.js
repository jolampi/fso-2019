const { ApolloServer, gql } = require('apollo-server')
const config = require('./utils/config')

const Author = require('./models/author')
const Book = require('./models/book')
const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)

console.log('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
    .then(() => console.log('connected to MongoDB'))
    .catch(error => console.log('error connecting to MongoDB:', error.message))


/* const clear = async () => {
    await Author.deleteMany({})
    await Book.deleteMany({})
}
clear() */

/*
 * It would be more sensible to assosiate book and the author by saving 
 * the author id instead of the name to the book.
 * For simplicity we however save the author name.
*/

const typeDefs = gql`
    type Author {
        born: Int
        name: String!
        bookCount: Int!
        id: ID!
    }

    type Book {
        title: String!
        published: Int!
        author: Author!
        id: ID!
        genres: [String!]!
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
    }

    type Mutation {
        addBook(
            title: String!
            published: Int!
            author: String!
            genres: [String!]!
        ) : Book
        editAuthor(
            name: String!
            setBornTo: Int!
        ) : Author
    }
`

/* {if (args.author) { result = result.filter(book => book.author === args.author) }
    if (args.genre) { result = result.filter(book => book.genres.includes(args.genre)) }*/

const resolvers = {
    Query: {
        bookCount: async () => {
            const books = await Book.find({})
            return books.length
        },
        authorCount: async () => {
            const authors = await Author.find({})
            return authors.length
        },
        allAuthors: () => Author.find({}),
        allBooks: (root, args) => Book.find({}).populate('author')
    },
    Author: {
        bookCount: async (root) => {
            const books = await Book.find({ author: root.id })
            return books.length
        }
    },
    Mutation: {
        addBook: async (root, args) => {
            let authorId
            await Author.findOne({ name: args.author }, (err, author) => {
                if (author) { authorId = author._id }
            })
            if (!authorId) {
                const newAuthor = await new Author({ name: args.author }).save()
                authorId = newAuthor._id
            }
            const book = await new Book({ ...args, author: authorId }).save()
            const populatedBook = await book.populate('author').execPopulate()
            return populatedBook
        },
        editAuthor: async (root, args) => {
            let author
            await Author.findOne({ name: args.name }, (err, a) => {
                if (a) { author = a }
            })
            if (author) {
                const updatedAuthor = await Author
                    .findByIdAndUpdate(author.id, { born: args.setBornTo }, { new: true })
                return updatedAuthor
            }
            return null
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})
