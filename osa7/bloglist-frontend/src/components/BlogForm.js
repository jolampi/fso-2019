import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useField } from '../hooks'

import { Button, Form } from 'semantic-ui-react'

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
                props.afterSubmit()
            } else {
                props.setNotification(error, true, 10)
            }
        })
    }

    const onCancel = async (event) => {
        event.preventDefault()
        props.afterSubmit()
    }

    return (
        <>
            <h2>create new</h2>
            <Form onSubmit={onSubmit}>
                <Form.Field>
                    title:
                    <input data-cy="blogTitle" {...title} />
                </Form.Field>
                <Form.Field>
                    author:
                    <input data-cy="blogAuthor" {...author} />
                </Form.Field>
                <Form.Field>
                    url:
                    <input data-cy="blogUrl" {...url} />
                </Form.Field>
                <Button type="submit" data-cy="submit">create</Button>
                <Button onClick={onCancel}>cancel</Button>
            </Form>
        </>
    )
}

BlogForm.propTypes = {
    token: PropTypes.string.isRequired,
    afterSubmit: PropTypes.func.isRequired,
    createBlog: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    token: state.user.token
})

export default connect(mapStateToProps, { createBlog, setNotification })(BlogForm)
