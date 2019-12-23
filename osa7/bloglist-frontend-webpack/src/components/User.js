import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import BlogList from './BlogList'

const User = (props) => (
    (!props.user) ? null : (
        <div className="user">
            <h2>{props.user.name}</h2>
            <h3>added blogs</h3>
            <BlogList blogs={props.user.blogs} />
        </div>
    )
)

User.defaultTypes = {
    user: null
}

User.propTypes = {
    user: PropTypes.object
}

export default User



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
            .find(user => user.id === ownProps.match.params.id)
    }
}

export const ConnectedUser = withRouter(
    connect(mapStateToProps)(User)
)
