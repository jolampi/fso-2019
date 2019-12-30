import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { ApolloConsumer, Mutation, Query } from 'react-apollo'

import Authors from './components/Authors'
import EditAuthor from './components/EditAuthor'
import Books from './components/Books'
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

const App = () => {
    const [page, setPage] = useState('authors')

    return (
        <div>
            <div>
                <button onClick={() => setPage('authors')}>authors</button>
                <button onClick={() => setPage('books')}>books</button>
                <button onClick={() => setPage('add')}>add book</button>
            </div>
            <ApolloConsumer>
                {client => <div>
                    <Query query={ALL_AUTHORS}>
                        {result =>
                            <div>
                                <Authors
                                    show={page === 'authors'}
                                    result={result}
                                />
                                <Mutation
                                    mutation={EDIT_AUTHOR}
                                    refetchQueries={[{ query: ALL_AUTHORS }]}
                                >
                                    {editAuthor => <EditAuthor
                                        show={page === 'authors'}
                                        result={result}
                                        editAuthor={editAuthor}
                                    />}
                                </Mutation>
                            </div>
                        }
                    </Query>
                    <Query query={ALL_BOOKS}>
                        {result => <Books 
                            show={page === 'books'}
                            result={result}
                            />}
                    </Query>
                    <Mutation
                        mutation={CREATE_BOOK}
                        refetchQueries={[{ query: ALL_AUTHORS }, { query: ALL_BOOKS }]}
                    >
                        {addBook => <NewBook
                            show={page === 'add'}
                            addBook={addBook}
                        />}
                    </Mutation>
                </div>}
            </ApolloConsumer>
        </div>
    )
}

export default App
