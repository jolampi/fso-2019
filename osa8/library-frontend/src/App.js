import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useApolloClient, useMutation, useQuery, useSubscription } from '@apollo/react-hooks'

import Authors from './components/Authors'
import EditAuthor from './components/EditAuthor'
import Books, { FIND_BOOKS_BY_GENRE } from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'

const BOOK_DETAILS = gql`
    fragment BookDetails on Book {
        title
        published
        author {
            name
            born
            bookCount
            id
        }
        genres
        id
    }
`

const ALL_AUTHORS = gql`
    {
        allAuthors {
            name
            born
            bookCount
            id
        }
    }
`

const CREATE_BOOK = gql`
    mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
        addBook(
            title: $title,
            published: $published,
            author: $author,
            genres: $genres
        ) {
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`

const EDIT_AUTHOR = gql`
    mutation editAuthor($name: String!, $setBornTo: Int!) {
        editAuthor(
            name: $name,
            setBornTo: $setBornTo
        ) {
            name
            born
            id
        }
    }
`

const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`

const ME = gql`
    {
        me {
            favouriteGenre
        }
    }
`

const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`


const App = () => {
    const [page, setPage] = useState('authors')
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    
    const client = useApolloClient()

    const authors = useQuery(ALL_AUTHORS)
    const [editAuthor] = useMutation(EDIT_AUTHOR, {
        onError: () => {},
        refetchQueries: [{ query: ALL_AUTHORS }]
    })

    const updateCacheWith = (addedBook) => {
        // Add author if new
        const authorsInStore = client.readQuery({ query: ALL_AUTHORS })
        if (!authorsInStore.allAuthors.map(a => a.id).includes(addedBook.author.id)) {
            client.writeQuery({
                query: ALL_AUTHORS,
                data: { allAuthors: authorsInStore.allAuthors.concat(addedBook.author) }
            })
        }

        // Update each existing cached result per genre
        addedBook.genres.concat(null).forEach(genre => {
            let queryObject = { query: FIND_BOOKS_BY_GENRE }
            if (genre) { queryObject = { ...queryObject, variables: { genre } } }
            try {
                const booksInStore = client.readQuery(queryObject)
                if (!booksInStore.allBooks.map(b => b.id).includes(addedBook.id)) {
                    client.writeQuery({
                        ...queryObject,
                        data: { allBooks: booksInStore.allBooks.concat(addedBook) }
                    })
                }
            } catch(error) { /* no cache data to update */ }
        })
    }

    const [addBook] = useMutation(CREATE_BOOK, {
        onError: () => {},
        update: (store, response) => {
            updateCacheWith(response.data.addBook)
        }
    })

    const [login] = useMutation(LOGIN, {
        onError: () => {}
    })

    useSubscription(BOOK_ADDED, {
        onSubscriptionData: ({ subscriptionData }) => {
            const bookAdded = subscriptionData.data.bookAdded
            updateCacheWith(bookAdded)
            window.alert(`${subscriptionData.data.bookAdded.title} added!!!`)
        }
    })

    const handleLogin = async (username, password, callback) => {
        let success = true
        const result = await login({ variables: { username, password } })
        
        if (result) {
            const token = result.data.login.value
            localStorage.setItem('LibraryAppUserToken', token)
            setToken(token)
            
            const { data } = await client.query({ query: ME })
            setUser(data.me)

            setPage('authors')
        } else { success = false }

        if (callback) { callback(success) }
    }

    const handleLogout = () => {
        setToken(null)
        localStorage.clear()
        client.resetStore()
    }
    
    return (
        <div>
            <div>
                <button onClick={() => setPage('authors')}>authors</button>
                <button onClick={() => setPage('books')}>books</button>
                {(!token) ? (
                        <button onClick={() => setPage('login')}>login</button>
                    ) : (
                        <div style={({ display: 'inline-block' })}>
                            <button onClick={() => setPage('recommend')}>recommend</button>
                            <button onClick={() => setPage('add')}>add book</button>
                            <button onClick={handleLogout}>logout</button>
                        </div>
                )}
            </div>
            <div>
                <Authors show={page === 'authors'} result={authors} />
                <EditAuthor
                    show={token && page === 'authors'}
                    result={authors}
                    editAuthor={editAuthor} />
                <Books
                    show={page === 'books' || page === 'recommend'}
                    recommend={(page === 'recommend') ? user.favouriteGenre : null}
                />
                <LoginForm
                    show={page === 'login'}
                    handleLogin={handleLogin}
                />
                <NewBook
                    show={page === 'add'}
                    addBook={addBook}
                />
            </div>
        </div>
    )
}

export default App
