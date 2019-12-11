import React, { useState } from 'react'

const BlogForm = ({ handleNewBlog }) => {
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [url, setUrl] = useState("")

    const onSubmit = async (event) => {
        event.preventDefault()
        const blogObject = { title, author, url }
        if (await handleNewBlog(blogObject)) {
            setTitle("")
            setAuthor("")
            setUrl("")
        }        
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div>
                    title:
                    <input
                        type="text"
                        value={title}
                        name="Title"
                        onChange={ ({target}) => setTitle(target.value) }
                    />
                </div>
                <div>
                    author:
                    <input
                        type="text"
                        value={author}
                        name="Author"
                        onChange={ ({target}) => setAuthor(target.value) }
                    />
                </div>
                <div>
                    url:
                    <input
                        type="text"
                        value={url}
                        name="Url"
                        onChange={ ({target}) => setUrl(target.value) }
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm
