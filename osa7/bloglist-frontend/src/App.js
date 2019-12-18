import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { setNotification } from './reducers/notificationReducer'

import { useField } from './hooks'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = (props) => {
    const username = useField('text')
    const password = useField('password')
    const [user, setUser] = useState(null)
    const [blogs, setBlogs] = useState([])
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
            const createdBlog = await blogService.create(blogObject, user.token)
            blogFormRef.current.toggleVisibility()
            setBlogs(blogs.concat(createdBlog))
            handleNotification(`a new blog ${createdBlog.title} added`, false)
        } catch(exception) {
            handleNotification(exception.response.data.error, true)
            success = false
        }
        return success
    }

    const handleNotification = (message, warning) => {
        props.setNotification(message, warning, 10)
    }

    // maybe refactor this to use object reference
    const incrementLikes = async (id) => {
        const blog = blogs.find(b => b.id === id)
        const changedBlog = {
            ...blog,
            user: blog.user.id,
            likes: blog.likes + 1
        }
        try {
            const updatedBlog = await blogService.update(id, changedBlog)
            setBlogs(blogs.map(blog => blog.id !== id ? blog : updatedBlog))
        } catch(exception) {
            handleNotification(`the blog '${blog.title}' was already deleted from server`, true)
            setBlogs(blogs.filter(blog => blog.id !== id))
        }
    }

    const removeBlog = async (blogToRemove) => {
        if (window.confirm(`Remove ${blogToRemove.title}?`)) {
            try {
                await blogService.remove(blogToRemove.id, user.token)
                setBlogs(blogs.filter(blog => blog.id !== blogToRemove.id))
                handleNotification(`Removed ${blogToRemove.title}`, false)
            } catch(exception) {
                handleNotification(`the blog '${blogToRemove.title}' was already deleted from server`, true)
                setBlogs(blogs.filter(blog => blog.id !== blogToRemove.id))
            }
        }
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
            <div className='blogs'>
                {blogs
                    .sort((blog1, blog2) => blog2.likes - blog1.likes)
                    .map(blog =>
                        <Blog
                            key={blog.id}
                            blog={blog}
                            userid={user.id}
                            incrementLikes={() => incrementLikes(blog.id)}
                            removeBlog={() => removeBlog(blog)}
                        />
                    )
                }
            </div>
        </div>
    )
}

export default connect(null, { setNotification })(App)
