import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { incrementLikes, removeBlog } from '../reducers/blogReducer'
import Blog from './Blog'


const BlogList = (props) => {
    const handleRemove = (blog) => {
        if (window.confirm(`Remove ${blog.title}?`)) {
            props.removeBlog(blog, props.user.token)
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
                        isOwner={blog.user.id === props.user.id}
                        incrementLikes={() => props.incrementLikes(blog)}
                        removeBlog={() => {handleRemove(blog)}}
                    />
                )
            }
        </div>
    )
}

BlogList.propTypes = {
    blogs: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    incrementLikes: PropTypes.func.isRequired,
    removeBlog: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    blogs: state.blogs,
    user: state.user
})

export default connect(
    mapStateToProps,
    { incrementLikes, removeBlog }
)(BlogList)
