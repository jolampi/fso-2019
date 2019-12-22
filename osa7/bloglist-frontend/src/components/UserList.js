import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { Table } from 'semantic-ui-react'

const UserList = (props) => (
    <div className="users">
        <h2>Users</h2>
        <Table celled>
            <Table.Header >
                <Table.Row>
                    <Table.HeaderCell>User</Table.HeaderCell>
                    <Table.HeaderCell>blogs created</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {props.users.map(user => (
                    <Table.Row key={user.id} className="user">
                        <Table.Cell><Link to={`/users/${user.id}`}>{user.name}</Link></Table.Cell>
                        <Table.Cell>{user.blogs}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
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
