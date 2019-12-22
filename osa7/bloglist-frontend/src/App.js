import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import { initializeBlogs } from './reducers/blogReducer'
import { login, logout, setSessionUser } from './reducers/loginReducer'
import { setNotification } from './reducers/notificationReducer'
import { useField } from './hooks'

import { Button, Container, Menu } from 'semantic-ui-react'
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
        if (props.user) { props.initializeBlogs() }
    // eslint-disable-next-line
    }, [ props.user ])

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
        await props.login(username.value, password.value, (success) => {
            if (success) {
                props.setNotification('succesfully logged in', false, 10)
                resetUsernameField()
                resetPasswordField()
            } else {
                props.setNotification('wrong username or password', true, 10)
            }
        })
    }

    return (props.user === null) ? (
        <Container>
            <Notification />
            <LoginForm
                onSubmit={handleLogin}
                username={username}
                password={password}
            />
        </Container>
    ) : (
        <Container>
            <Router>
                <Notification />
                <Menu inverted>
                    <Menu.Item link><Link to="/">Blogs</Link></Menu.Item>
                    <Menu.Item link><Link to="/users">Users</Link></Menu.Item>
                    <Menu.Item>
                        {props.user.name} logged in

                        <Button onClick={() => props.logout()}>logout</Button>
                    </Menu.Item>
                </Menu>
                <h2>blogs</h2>
                <Route exact path="/" render={() => (
                    <div>
                        <Togglable buttonLabel='new blog' ref={blogFormRef}>
                            <BlogForm afterSubmit={() => blogFormRef.current.toggleVisibility()} />
                        </Togglable>
                        <BlogList />
                    </div>
                )} />
                <Route exact path="/blogs/:id" render={() => <Blog />} />
                <Route exact path="/users" render={() => <UserList />} />
                <Route exact path="/users/:id" render={() => <User />} />
            </Router>
        </Container>
    )
}

const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(
    mapStateToProps,
    { initializeBlogs, login, logout, setNotification, setSessionUser }
)(App)
