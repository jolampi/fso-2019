import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { incrementLikes, removeBlog } from '../reducers/blogReducer'

const Blog = (props) => {
    const blog = props.blog

    const removeButton = {
        background: 'lightblue',
        display: (props.isRemovable) ? '' : 'none'
    }

    return (!blog) ? null : (
        <div className="blog">
            <h2>{blog.title}</h2>
            <div><a href={blog.url}>{blog.url}</a></div>
            <div>
                {blog.likes} likes
                <button onClick={props.onLike}>like</button>
            </div>
            <div>added by {blog.user.name}</div>
            <div>
                <button onClick={props.onRemove} style={removeButton}>remove</button>
            </div>
        </div>
    )
}

Blog.propTypes = {
    blog: PropTypes.object,
    isRemovable: PropTypes.bool.isRequired,
    onLike: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
}

export default Blog



const mapStateToProps = (state, ownProps) => {
    const blog = state.blogs.find(blog => blog.id === ownProps.match.params.id)
    const user = (state.user) ? state.user : {}
    return {
        blog,
        user,
        isRemovable: (blog) ? (blog.user.id === user.id) : false,
    }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const blog = stateProps.blog
    return {
        blog,
        isRemovable: stateProps.isRemovable,
        onLike: () => dispatchProps.incrementLikes(blog),
        onRemove: () => {
            if (window.confirm(`Remove '${blog.title}'?`)) {
                dispatchProps.removeBlog(blog, stateProps.user.token)
                ownProps.history.push('/')
            }
        }
    }
}

export const ConnectedBlog = withRouter(
    connect(mapStateToProps, { incrementLikes, removeBlog }, mergeProps)(Blog)
)
