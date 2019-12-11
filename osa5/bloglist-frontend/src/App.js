import React, { useEffect, useState } from 'react';

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm';
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [user, setUser] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [notificationMessage, setNotificationMessage] = useState(null)
    const [notificationWarning, setNotificationWarning] = useState(false)
    const blogFormRef = React.createRef()

    useEffect(() => {
        const loadBlogs = (async () => {
            const blogs = await blogService.getAll()
            setBlogs(blogs)
        })
        loadBlogs()
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
            const user = await loginService.login({ username, password })
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            setUser(user)
            setUsername("")
            setPassword("")
            newNotification("succesfully logged in", false)
        } catch(exception) {
            newNotification("wrong username or password", true)
        }
    }

    const handleLogout = () => {
        window.localStorage.clear()
        setUser(null)

    }

    const handleNewBlog = async (blogObject) => {
        let success = true
        try {
            const createdBlog = await blogService.create(blogObject, user.token)
            blogFormRef.current.toggleVisibility()
            setBlogs(blogs.concat(createdBlog))
            newNotification(`a new blog ${createdBlog.title} added`, false)
        } catch(exception) {
            newNotification(exception.response.data.error, true)
            success = false
        } finally {
            return success
        }
    }

    const newNotification = (message, warning) => {
        setNotificationMessage(message)
        setNotificationWarning(warning)
        setTimeout(() => {
            setNotificationMessage(null)
        }, 5000)
    }

    return (user === null) ? (
        <div>
            <Notification notification={notificationMessage} warning={notificationWarning} />
            <LoginForm 
                onSubmit={handleLogin}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
            />
        </div>
    ) : (
        <div>
            <h2>blogs</h2>
            <Notification notification={notificationMessage} warning={notificationWarning} />
            <p>
                {user.name} logged in
                <button onClick={handleLogout}>logout</button>
            </p>
            <Togglable buttonLabel='new blog' ref={blogFormRef}>
                <BlogForm handleNewBlog={handleNewBlog} />
            </Togglable>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
            )}
        </div>
    )
}

export default App;
