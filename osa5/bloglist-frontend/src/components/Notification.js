import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message, warning }) => {

    const notificationStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    const warningStyle = { ...notificationStyle, color: 'red' }

    if (message === null) { return null }

    return <div style={ warning ? warningStyle : notificationStyle }>{message}</div>
}

Notification.propTypes = {
    message: PropTypes.string,
    warning: PropTypes.bool
}

export default Notification
