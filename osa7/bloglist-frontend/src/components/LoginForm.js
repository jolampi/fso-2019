import React from 'react'
import PropTypes from 'prop-types'

import { Button, Form, Header } from 'semantic-ui-react'

const LoginForm = ({ onSubmit, username, password }) => (
    <div className='loginForm'>
        <Header as='h2'>Log in to application</Header>
        <Form onSubmit={onSubmit}>
            <Form.Field>
                username
                <input {...username} />
            </Form.Field>
            <Form.Field>
                password
                <input {...password} />
            </Form.Field>
            <Button type="submit">login</Button>
        </Form>
    </div>
)

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    username: PropTypes.object.isRequired,
    password: PropTypes.object.isRequired,
}

export default LoginForm
