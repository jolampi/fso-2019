import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useField } from '../hooks'

const BlogForm = (props) => {
    const [title, resetTitleField] = useField('text')
    const [author, resetAuthorField] = useField('text')
    const [url, resetUrlField] = useField('text')

    const onSubmit = async (event) => {
        event.preventDefault()
        const blogObject = {
            title: title.value,
            author: author.value,
            url: url.value
        }
        await props.createBlog(blogObject, props.token, (success, error) => {
            if (success) {
                props.setNotification(`a new blog ${blogObject.title} added`, false, 10)
                resetTitleField()
                resetAuthorField()
                resetUrlField()
                props.blogFormRef.current.toggleVisibility()
            } else {
                props.setNotification(error, true, 10)
            }
        })
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={onSubmit}>
                <div>
                    title:
                    <input {...title} />
                </div>
                <div>
                    author:
                    <input {...author} />
                </div>
                <div>
                    url:
                    <input {...url} />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

BlogForm.propTypes = {
    blogFormRef: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    createBlog: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    token: state.user.token
})

export default connect(mapStateToProps, { createBlog, setNotification })(BlogForm)
