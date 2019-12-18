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
                <div>{blog.url}</div>
                <div>{blog.likes} likes</div>
                <div><button onClick={incrementLikes}>like</button></div>
                <div>added by {blog.user ? blog.user.name : 'NaN'}</div>
                <div><button onClick={removeBlog} style={removeButtonStyle}>remove</button></div>
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
