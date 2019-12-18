import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { initializeBlogs } from './reducers/blogReducer'
import {  clearUser, login, setUser } from './reducers/userReducer'

import { useField } from './hooks'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = (props) => {
    const [username, resetUsernameField] = useField('text')
    const [password, resetPasswordField] = useField('password')
    const blogFormRef = React.createRef()

    useEffect(() => {
        props.initializeBlogs()
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            props.setUser(user)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()
        await props.login(username.value, password.value)
        resetUsernameField()
        resetPasswordField()
    }

    return (props.user === null) ? (
        <div>
            <Notification />
            <LoginForm
                onSubmit={handleLogin}
                username={username}
                password={password}
            />
        </div>
    ) : (
        <div>
            <h2>blogs</h2>
            <Notification />
            <p>
                {props.user.name} logged in
                <button onClick={() => props.clearUser()}>logout</button>
            </p>
            <Togglable buttonLabel='new blog' ref={blogFormRef}>
                <BlogForm blogFormRef={blogFormRef} />
            </Togglable>
            <BlogList />
        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(
    mapStateToProps,
    { initializeBlogs, setUser, clearUser, login }
)(App)
