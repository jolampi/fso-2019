import React, { useState, useEffect } from 'react'
import { gql } from 'apollo-boost'
import { useApolloClient } from '@apollo/react-hooks'

const FIND_BOOKS_BY_GENRE = gql`
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
    const client = useApolloClient()

    useEffect(() => {
        const queryBooks = async () => {
            const { data } = await client.query({
                query: FIND_BOOKS_BY_GENRE,
                variables: (filter) ? { genre: filter } : {}
            })
            setBooks(data.allBooks)
            let foundGenres = genres
            data.allBooks.forEach(book => {
                book.genres.forEach(g => {
                    if (!foundGenres.includes(g)) { foundGenres = foundGenres.concat(g) }
                })
                setGenres(foundGenres.sort())
            })
        }
        queryBooks()
    // eslint-disable-next-line
    }, [filter])
    
    if (!props.show) {
        return null
    }

    return (
        <div>
            <h2>books</h2>
            {!filter ? null : <div>in genre <strong>{filter}</strong></div>}
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
            <div>
                {genres.map(genre =>
                    <button
                        key={genre}
                        onClick={() => setFilter(genre)}
                    >{genre}</button>
                )}
                <button onClick={() => setFilter(null)}>all genres</button>
            </div>
        </div>
    )
}

export default Books
