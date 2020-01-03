import React, { useState } from 'react'

const EditAuthor = (props) => {
    const [name, setName] = useState({value: ''})
    const [born, setBorn] = useState('')

    if (!props.show || props.result.loading) {
        return null
    }

    const submit = async (event) => {
        event.preventDefault()
        await props.editAuthor({
            variables: { name: name.value, setBornTo: Number(born) }
        })
        setName({ value: '' })
        setBorn('')
    }

    return (
        <div>
            <h2>set birthyear</h2>
            <form onSubmit={submit}>
                <div>
                    name
                    <select value={name.value} onChange={({target}) => setName({value: target.value})}>
                        {props.result.data.allAuthors.map(author =>
                            <option key={author.id} value={author.name}>{author.name}</option>
                        )}
                    </select>
                </div>
                <div>
                    born
                    <input
                        type="number"
                        value={born}
                        onChange={({ target }) => setBorn(target.value)} />
                </div>
                <button type="submit">update author</button>
            </form>
        </div>
    )
}

export default EditAuthor
