
const reducer = (state = '', action) => {
    switch (action.type) {
        case 'NOTIFICATION':
            return action.data
        default:
            return state
    }
}

export default reducer

export const setNotification = (message) => ({
    type: 'NOTIFICATION',
    data: message
})
