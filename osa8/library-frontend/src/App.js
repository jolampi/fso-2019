import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks'

import Authors from './components/Authors'
import EditAuthor from './components/EditAuthor'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'

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

const ALL_BOOKS = gql`
{
    allBooks {
        title
        author {
            name
        }
        published
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
        title
        published
        author {
            name
            born
        }
        genres
    }
}
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


const App = () => {
    const [page, setPage] = useState('authors')
    const [token, setToken] = useState(null)
    
    const client = useApolloClient()

    const authors = useQuery(ALL_AUTHORS)
    const [editAuthor] = useMutation(EDIT_AUTHOR, {
        onError: () => {},
        refetchQueries: [{ query: ALL_AUTHORS }]
    })

    const books = useQuery(ALL_BOOKS)
    const [addBook] = useMutation(CREATE_BOOK, {
        onError: () => {},
        refetchQueries: [{ query: ALL_BOOKS }]
    })

    const [login] = useMutation(LOGIN, {
        onError: () => {}
    })

    const handleLogin = async (username, password, callback) => {
        let success = true
        const result = await login({ variables: { username, password } })
        
        if (result) {
            const token = result.data.login.value
            localStorage.setItem('LibraryAppUserToken', token)
            setToken(token)
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
                <Books show={page === 'books'} result={books} />
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
