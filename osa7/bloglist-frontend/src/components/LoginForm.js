import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ onSubmit, username, password }) => (
    <div className='loginForm'>
        <h2>Log in to application</h2>
        <form onSubmit={onSubmit}>
            <div>
                username
                <input {...username} />
            </div>
            <div>
                password
                <input {...password} />
            </div>
            <button type="submit">login</button>
        </form>
    </div>
)

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    username: PropTypes.object.isRequired,
    password: PropTypes.object.isRequired,
}

export default LoginForm
