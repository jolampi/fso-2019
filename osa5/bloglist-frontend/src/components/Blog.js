import React, { useState } from 'react'

const Blog = ({ blog }) => {
    const [detailed, setDetailed] = useState(false)

    const toggleDetailed = () => { setDetailed(!detailed) }
    
    const detailedView = { display: detailed ? '' : 'none' }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderColor: 'lightgrey',
        borderWidth: 1,
        marginBottom: 5
    }

    return (
        <div style={blogStyle}>
            <div onClick={() => toggleDetailed()}>
                {blog.title} - {blog.author}
            </div>
            <div style={detailedView}>
                {blog.url} <br />
                {blog.likes} likes
                <button>like</button> <br />
                added by {blog.user ? blog.user.name : 'NaN'}
            </div>
        </div>
    )
}

export default Blog
