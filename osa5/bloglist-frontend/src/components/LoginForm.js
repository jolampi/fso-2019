import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ onSubmit, setUsername, setPassword, username, password }) => (
    <div>
        <h2>Log in to application</h2>
        <form onSubmit={onSubmit}>
            <div>
                username
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={ ({ target }) => setUsername(target.value) }
                />
            </div>
            <div>
                password
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={ ({ target }) => setPassword(target.value) }
                />
            </div>
            <button type="submit">login</button>
        </form>
    </div>
)

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    setUsername: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
}

export default LoginForm
