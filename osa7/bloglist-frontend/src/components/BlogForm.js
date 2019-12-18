import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { createBlog } from '../reducers/blogReducer'
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
        await props.createBlog(blogObject, props.token)
        resetTitleField()
        resetAuthorField()
        resetUrlField()
        props.blogFormRef.current.toggleVisibility()
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

export default connect(mapStateToProps, { createBlog })(BlogForm)
