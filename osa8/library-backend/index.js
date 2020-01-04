const { ApolloServer, AuthenticationError, gql, PubSub, UserInputError } = require('apollo-server')
const config = require('./utils/config')
const jwt = require('jsonwebtoken')
const pubsub = new PubSub()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
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

    type User {
        username: String!
        favouriteGenre: String!
        id: ID!
    }

    type Token {
        value: String!
    }

    type Query {
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
        authorCount: Int!
        bookCount: Int!
        me: User
    }

    type Mutation {
        addBook(
            title: String!
            published: Int!
            author: String!
            genres: [String!]!
        ) : Book
        createUser(
            username: String!
            favouriteGenre: String!
        ) : User
        editAuthor(
            name: String!
            setBornTo: Int!
        ) : Author
        login(
            username: String!
            password: String!
        ) : Token
    }

    type Subscription {
        bookAdded: Book!
    }
`

const findAuthorByName = async (name) => {
    let result
    await Author.findOne({ name }, (error, author) => {
        if (author) { result = author }
    })
    return result
}

const resolvers = {
    Query: {
        allAuthors: () => Author.find({}),
        allBooks: async (root, args) => {
            const matcher = {}
            let author
            
            if (args.genre) { matcher.genres = { $in: [`${args.genre}`] } }
            
            if (args.author) { author = await findAuthorByName(args.author) }
            if (author) { matcher.author = author }
            
            return Book.find(matcher).populate('author')
        },
        authorCount: async () => {
            const authors = await Author.find({})
            return authors.length
        },
        bookCount: async () => {
            const books = await Book.find({})
            return books.length
        },
        me: (root, args, context) => context.currentUser

    },
    Author: {
        bookCount: async (root) => {
            const books = await Book.find({ author: root.id })
            return books.length
        }
    },
    Mutation: {
        addBook: async (root, args, context) => {
            if (!context.currentUser) { throw new AuthenticationError('not authenticated') }

            let authorId
            const author = await findAuthorByName(args.author)
            if (author) {
                authorId = author._id
            } else {
                try {
                    const newAuthor = await new Author({ name: args.author }).save()
                    authorId = newAuthor._id
                } catch(error) {
                    throw new UserInputError(error.message, { invalidArgs: [ args.author ] })
                }
            }

            try {
                const book = await new Book({ ...args, author: authorId }).save()
                const populatedBook = await book.populate('author').execPopulate()
                
                pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook })
                return populatedBook
            } catch(error) {
                throw new UserInputError(error.message, { invalidArgs: args })
            }
        },
        createUser: async (root, args) => {
            const user = new User({
                username: args.username,
                favouriteGenre: args.favouriteGenre

            })

            try {
                return await user.save()
            } catch(error) { throw new UserInputError(error.message, { invalidArgs: args }) }
        },
        editAuthor: async (root, args, context) => {
            if (!context.currentUser) { throw new AuthenticationError('not authenticated') }

            const author = await findAuthorByName(args.name)
            if (!author) { return null }

            try {
                const updatedAuthor = await Author
                    .findByIdAndUpdate(author.id, { born: args.setBornTo }, { new: true })
    
                return updatedAuthor
            } catch(error) {
                throw new UserInputError(error.message, { invalidArgs: args })
            }
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if (!user || args.password !== 'hunter2') {
                throw new UserInputError('wrong username or password')
            }

            const userForToken = {
                username: user.username,
                favouriteGenre: user.favouriteGenre,
                id: user._id
            }

            return { value: jwt.sign(userForToken, config.JWT_SECRET) }
        }
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
            const decodedToken = jwt.verify(auth.substring(7), config.JWT_SECRET)
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
        }
    }
})

server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`Server ready at ${url}`)
    console.log(`Subsciptions ready at ${subscriptionsUrl}`)
})
