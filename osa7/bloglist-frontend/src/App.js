import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { createBlog, initializeBlogs } from './reducers/blogReducer'
import { setNotification } from './reducers/notificationReducer'

import { useField } from './hooks'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import loginService from './services/login'

const App = (props) => {
    const username = useField('text')
    const password = useField('password')
    const [user, setUser] = useState(null)
    const blogFormRef = React.createRef()

    useEffect(() => {
        props.initializeBlogs()
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({
                username: username.props.value,
                password: password.props.value
            })
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            setUser(user)
            username.reset()
            password.reset()
            handleNotification('succesfully logged in', false)
        } catch(exception) {
            handleNotification('wrong username or password', true)
        }
    }

    const handleLogout = () => {
        window.localStorage.clear()
        setUser(null)

    }

    const handleNewBlog = async (blogObject) => {
        let success = true
        try {
            await props.createBlog(blogObject, user.token)
            handleNotification(`a new blog ${blogObject.title} added`, false)
        } catch(exception) {
            handleNotification(exception.response.data.error, true)
            success = false
        }
        return success
    }

    const handleNotification = (message, warning) => {
        props.setNotification(message, warning, 10)
    }

    return (user === null) ? (
        <div>
            <Notification />
            <LoginForm
                onSubmit={handleLogin}
                username={username.props}
                password={password.props}
            />
        </div>
    ) : (
        <div>
            <h2>blogs</h2>
            <Notification />
            <p>
                {user.name} logged in
                <button onClick={handleLogout}>logout</button>
            </p>
            <Togglable buttonLabel='new blog' ref={blogFormRef}>
                <BlogForm handleNewBlog={handleNewBlog} />
            </Togglable>
            <BlogList />
        </div>
    )
}

export default connect(
    null,
    { createBlog, initializeBlogs, setNotification }
)(App)
