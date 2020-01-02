import React, { useState } from 'react'

const LoginForm = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const submit = async (event) => {
        event.preventDefault()

        props.handleLogin(username, password, success => {
            if (success) {
                setUsername('')
                setPassword('')
            }
        })
    }

    if (!props.show) { return null }

    return (
        <div>
            <h2>login</h2>
            <form onSubmit={submit}>
                <div>
                    username
                    <input
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        type="password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default LoginForm
