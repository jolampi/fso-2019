import React, { useState } from 'react'

const Books = (props) => {
    const [genre, setGenre] = useState(null)

    if (!props.show || props.result.loading) {
        return null
    }

    const genresFromBooks = (genres, book) => {
        book.genres.forEach(genre => {
            if (!genres.includes(genre)) { genres = genres.concat(genre) }
        })

        return genres
    }

    return (
        <div>
            <h2>books</h2>
            {!genre ? null : <div>in genre <strong>{genre}</strong></div>}
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
                    {props.result.data.allBooks.filter(book =>
                        !genre || book.genres.includes(genre)
                    ).map(a =>
                        <tr key={a.id}>
                            <td>{a.title}</td>
                            <td>{a.author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div>
                {props.result.data.allBooks.reduce(genresFromBooks, []).map(genre =>
                    <button
                        key={genre}
                        onClick={() => setGenre(genre)}
                    >{genre}</button>
                )}
                <button onClick={() => setGenre(null)}>all genres</button>
            </div>
        </div>
    )
}

export default Books
