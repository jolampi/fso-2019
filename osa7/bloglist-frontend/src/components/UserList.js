import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const UserList = (props) => (
    <div className="users">
        <h2>Users</h2>
        <table>
            <thead>
                <tr>
                    <td />
                    <td><strong>blogs created</strong></td>
                </tr>
            </thead>
            <tbody>
                {props.users.map(user => (
                    <tr key={user.id} className="user">
                        <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
                        <td>{user.blogs}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)

const mapStateToProps = (state) => {
    const userToBlogCountReducer = (users, current) => {
        const user = current.user
        if (!users.has(user.id)) { users.set(user.id, { id: user.id, name: user.name, blogs: 0 }) }
        const value = users.get(user.id)
        users.set(user.id, { ...value, blogs: value.blogs + 1 })
        return users
    }
    const result = state.blogs.reduce(userToBlogCountReducer, new Map())
    return ({ users: Array.from(result.values()) })
}

export default connect(mapStateToProps)(UserList)
