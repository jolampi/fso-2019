import React from 'react'
import { connect } from 'react-redux'
import { incrementLikes, removeBlog } from '../reducers/blogReducer'
import Blog from './Blog'


const BlogList = (props) => {
    const handleRemove = (blog) => {
        if (window.confirm(`Remove ${blog.title}?`)) {
            props.removeBlog(blog)
        }
    }

    return (
        <div className='blogs'>
            {props.blogs
                .sort((blog1, blog2) => blog2.likes - blog1.likes)
                .map(blog =>
                    <Blog
                        key={blog.id}
                        blog={blog}
                        isOwner={false}
                        incrementLikes={() => props.incrementLikes(blog)}
                        removeBlog={() => {handleRemove(blog)}}
                    />
                )
            }
        </div>
    )
}

const mapStateToProps = (state) => ({
    blogs: state.blogs
})

export default connect(
    mapStateToProps,
    { incrementLikes, removeBlog }
)(BlogList)
