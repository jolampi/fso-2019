import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import { initializeBlogs } from './reducers/blogReducer'
import {  login, logout, setSessionUser } from './reducers/loginReducer'
import { useField } from './hooks'

import { ConnectedBlog as Blog } from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { ConnectedUser as User } from './components/User'
import UserList from './components/UserList'

const App = (props) => {
    const [username, resetUsernameField] = useField('text')
    const [password, resetPasswordField] = useField('password')
    const blogFormRef = React.createRef()

    useEffect(() => {
        props.initializeBlogs()
    // eslint-disable-next-line
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            props.setSessionUser(user)
        }
    // eslint-disable-next-line
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()
        await props.login(username.value, password.value)
        resetUsernameField()
        resetPasswordField()
    }

    const padding = { padding: 7 }

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
            <Router>
                <h2>blogs</h2>
                <Notification />
                <div>
                    <Link style={padding} to="/">Blogs</Link>
                    <Link style={padding} to="/users">Users</Link>
                    {props.user.name} logged in
                    <button onClick={() => props.logout()}>logout</button>
                </div>
                <Route exact path="/" render={() => (
                    <div>
                        <Togglable buttonLabel='new blog' ref={blogFormRef}>
                            <BlogForm blogFormRef={blogFormRef} />
                        </Togglable>
                        <BlogList />
                    </div>
                )} />
                <Route exact path="/blogs/:id" render={() => <Blog />} />
                <Route exact path="/users" render={() => <UserList />} />
                <Route exact path="/users/:id" render={() => <User />} />
            </Router>
        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(
    mapStateToProps,
    { initializeBlogs, login, logout, setSessionUser }
)(App)
