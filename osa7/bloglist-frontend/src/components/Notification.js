import React from 'react'
import { connect } from 'react-redux'
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

    if (message === '') { return null }

    return <div style={ warning ? warningStyle : notificationStyle }>{message}</div>
}

Notification.propTypes = {
    message: PropTypes.string.isRequired,
    warning: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => {
    return {
        message: state.notification.message,
        warning: state.notification.warning
    }
}

export default connect(mapStateToProps)(Notification)
