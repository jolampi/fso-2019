import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Message } from 'semantic-ui-react'

const Notification = ({ message, warning }) => {

    if (message === '') { return null }

    return (!warning) ? (
        <Message success>{message}</Message>
    ) : (
        <Message error>{message}</Message>
    )
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
