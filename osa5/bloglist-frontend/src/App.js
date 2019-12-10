import React, { useEffect, useState } from 'react';

import Blog from './components/Blog'
import LoginForm from './components/LoginForm';

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [user, setUser] = useState(null)
    const [blogs, setBlogs] = useState([])

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({ username, password })
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            setUser(user)
            setUsername("")
            setPassword("")
        } catch(exception) {
            console.log('wrong credentials')
        }
    }

    const handleLogout = () => {
        window.localStorage.clear()
        setUser(null)
    }

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

    return (user === null) ? (
        <div>
            <h2>Log in to application</h2>
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
            <p>
                {user.name} logged in
                <button onClick={handleLogout}>logout</button>
            </p>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
            )}
        </div>
    )
}

export default App;
