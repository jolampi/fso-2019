import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { incrementLikes, removeBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const Blog = (props) => {
    const blog = props.blog

    const removeButton = {
        background: 'lightblue',
        display: (props.isRemovable) ? '' : 'none'
    }

    return (!blog) ? null : (
        <div className="blog">
            <h2>
                {blog.title} {blog.author}
            </h2>
            <div><a href={blog.url}>{blog.url}</a></div>
            <div>
                {blog.likes} likes
                <button className="blogLikeButton" onClick={props.onLike}>like</button>
            </div>
            <div>added by {blog.user.name}</div>
            <div>
                <button className="blogRemoveButton" onClick={props.onRemove} style={removeButton}>
                    remove
                </button>
            </div>
        </div>
    )
}

Blog.defaultProps = {
    blog: null,
    isRemovable: false,
    onLike: null,
    onRemove: null
}

Blog.propTypes = {
    blog: PropTypes.object,
    isRemovable: PropTypes.bool.isRequired,
    onLike: PropTypes.func,
    onRemove: PropTypes.func
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

    const onLike = () => {
        dispatchProps.incrementLikes(blog, (success) => {
            if (!success) {
                dispatchProps
                    .setNotification(`the blog '${blog.title}' was removed from server`, true, 10)
                ownProps.history.push('/')
            }
        })
    }

    const onRemove = () => {
        if (window.confirm(`Remove '${blog.title}'?`)) {
            dispatchProps.removeBlog(blog, stateProps.user.token, (success) => {
                if (success) {
                    dispatchProps.setNotification(`Removed '${blog.title}'`, false, 10)
                } else {
                    dispatchProps
                        .setNotification(`the blog '${blog.title}' was already removed from server`, true, 10)
                }
                ownProps.history.push('/')
            })
        }
    }

    return { blog, isRemovable: stateProps.isRemovable, onLike, onRemove }
}

export const ConnectedBlog = withRouter(connect(
    mapStateToProps,
    { incrementLikes, removeBlog, setNotification },
    mergeProps
)(Blog))
