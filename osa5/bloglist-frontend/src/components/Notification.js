import React, { useState, useImperativeHandle } from 'react'

const Notification = React.forwardRef((props, ref) => {
    const [message, setMessage] = useState(null)
    const [warning, setWarning] = useState(false)

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

    const setNotification = (message, warning) => {
        setMessage(message)
        setWarning(warning)
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

    useImperativeHandle(ref, () => {
        return { setNotification }
    })

    if (message === null) { return null }

    return <div style={ warning ? warningStyle : notificationStyle }>{message}</div>
})

export default Notification
