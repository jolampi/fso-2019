import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useField } from '../hooks'
import { createComment } from '../reducers/blogReducer'

import { Button, Form } from 'semantic-ui-react'

const CommentForm = (props) => {
    const [comment, resetCommentField] = useField('text')

    const onSubmit = async (event) => {
        event.preventDefault()
        if (comment.value === '') { return }
        await props.createComment(props.blogId, comment.value, (success) => {
            if (success) { resetCommentField() }
        })
    }

    return (
        <div>
            <Form onSubmit={onSubmit}>
                <Form.Field>
                    <input { ...comment } />
                </Form.Field>
                <Button type="submit">comment</Button>
            </Form>
        </div>
    )
}

CommentForm.propTypes = {
    blogId: PropTypes.string.isRequired
}

export default CommentForm



export const ConnectedCommentForm = connect(null, { createComment })(CommentForm)
