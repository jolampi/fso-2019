import React, { useState, useEffect } from 'react'
import { gql } from 'apollo-boost'
import { useApolloClient } from '@apollo/react-hooks'

export const FIND_BOOKS_BY_GENRE = gql`
    query findBooksByGenre($genre: String) {
        allBooks(genre: $genre) {
            title
            author {
                name
            }
            published
            genres
            id
        }
    }
`

const Books = (props) => {
    const [filter, setFilter] = useState(null)
    const [genres, setGenres] = useState([])
    const [books, setBooks] = useState([])
    const [forceUpdate, setForceUpdate] = useState(false)
    const client = useApolloClient()

    useEffect(() => {
        const queryBooks = async () => {
            const queryObject = { query: FIND_BOOKS_BY_GENRE }
            if (filter) { queryObject.variables = { genre: filter } }
            const { data } = await client.query(queryObject)
            setBooks(data.allBooks)
            setGenres(genres => {
                let foundGenres = genres
                data.allBooks.forEach(book => {
                    book.genres.forEach(g => {
                        if (!foundGenres.includes(g)) { foundGenres = foundGenres.concat(g) }
                    })
                })
                return foundGenres.sort()
            })
        }
        queryBooks()
    }, [client, filter, forceUpdate])
    
    if (!props.show) { return null }

    if (props.recommend && props.recommend !== filter) {
        setFilter(props.recommend)
    }

    const handleClick = (value) => {
        if (filter === value) {
            setForceUpdate(!forceUpdate)
        } else {
            setFilter(value)
        }
    }

    const subHeader = () => {
        if (!filter) { return null }
        return (
            <div>
                {props.recommend ? <>books in your favourite genre</> : <>in genre</>}
                <strong> {filter}</strong>
            </div>
        )
    }

    return (
        <div>
            <h2>books</h2>
            {subHeader()}
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>
                            author
                        </th>
                        <th>
                            published
                        </th>
                    </tr>
                    {books.map(a =>
                        <tr key={a.id}>
                            <td>{a.title}</td>
                            <td>{a.author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {!props.recommend && (
                <div>
                    {genres.map(genre =>
                        <button
                            key={genre}
                            onClick={() => handleClick(genre)}
                        >{genre}</button>
                    )}
                    <button onClick={() => handleClick(null)}>all genres</button>
                </div>
            )}
        </div>
    )
}

export default Books
