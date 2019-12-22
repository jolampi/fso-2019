import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { incrementLikes, removeBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

import { Button, List } from 'semantic-ui-react'
import { ConnectedCommentForm as CommentForm } from './CommentForm'

const Blog = (props) => {
    const blog = props.blog

    const removeButton = {
        background: 'lightblue',
        display: (props.isRemovable) ? '' : 'none'
    }

    return (!blog) ? null : (
        <div className="blog">
            <h2>
                {blog.title}
                {blog.author && <> - {blog.author}</>}
            </h2>
            <div><a href={blog.url}>{blog.url}</a></div>
            <div>
                added by {blog.user.name}
                <Button className="blogRemoveButton" onClick={props.onRemove} style={removeButton}>
                    remove
                </Button>
            </div>
            <div>
                {blog.likes} likes
                <Button className="blogLikeButton" onClick={props.onLike}>like</Button>
            </div>
            <h3>comments</h3>
            <CommentForm blogId={blog.id} />
            <List as='ul'>
                {blog.comments
                    .sort((comment1, comment2) => new Date(comment2.date) - new Date(comment1.date))
                    .map(comment =>
                        <List.Item as='li' key={comment.id}>{comment.comment}</List.Item>
                    )
                }
            </List>
        </div>
    )
}

Blog.defaultProps = {
    blog: null,
    isRemovable: false,
    onLike: null,
    onRemove: null,
    comments: []
}

Blog.propTypes = {
    blog: PropTypes.object,
    isRemovable: PropTypes.bool.isRequired,
    onLike: PropTypes.func,
    onRemove: PropTypes.func,
    comments: PropTypes.array.isRequired
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
                    .setNotification(`the blog '${blog.title}' was already removed from server`, true, 10)
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
