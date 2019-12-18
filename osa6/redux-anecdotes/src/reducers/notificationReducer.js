
const reducer = (state = '', action) => {
    switch (action.type) {
        case 'NOTIFICATION':
            return action.data
        case 'CLEAR':
            return ''
        default:
            return state
    }
}

export default reducer

export const setNotification = (message, seconds) => {
    return async (dispath) => {
        dispath({ type: 'NOTIFICATION', data: message })
        setTimeout(() => dispath({ type: 'CLEAR' }), seconds * 1000)
    }
}
