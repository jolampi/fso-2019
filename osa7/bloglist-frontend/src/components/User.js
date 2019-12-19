import React from 'react'
import { connect } from 'react-redux'

const User = (props) => (
    (!props.user) ? null : (
        <div>
            <h2>{props.user.name}</h2>
            <h3>added blogs</h3>
            <ul>
                {props.user.blogs.map(blog =>
                    <li key={blog.id}>{blog.title}</li>
                )}
            </ul>
        </div>
    )
)

const mapStateToProps = (state, ownProps) => {
    const usersFromBlogs = (users, blog) => {
        const id = blog.user.id
        if (!users.has(id)) { users.set(id, { ...blog.user, blogs: [] }) }
        const user = users.get(id)
        users.set(id, { ...user, blogs: user.blogs.concat(blog) })
        return users
    }
    return {
        user: Array
            .from(state.blogs.reduce(usersFromBlogs, new Map()).values())
            .find(user => user.id === ownProps.id)
    }
}

export default connect(mapStateToProps)(User)
