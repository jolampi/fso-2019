import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, userid, incrementLikes, removeBlog }) => {
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

    const removeButtonStyle = {
        background: 'lightblue',
        display: (blog.user.id === userid) ? '' : 'none'
    }

    return (
        <div className='blog' style={blogStyle}>
            <div className='blogTitle' onClick={() => toggleDetailed()}>
                {blog.title} {blog.author}
            </div>
            <div className='blogDetails' style={detailedView}>
                {blog.url} <br />
                {blog.likes} likes
                <button onClick={incrementLikes}>like</button> <br />
                added by {blog.user ? blog.user.name : 'NaN'} <br />
                <button  onClick={removeBlog} style={removeButtonStyle}>remove</button>
            </div>
        </div>
    )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    userid: PropTypes.string.isRequired,
    incrementLikes: PropTypes.func.isRequired,
    removeBlog: PropTypes.func.isRequired
}

export default Blog
