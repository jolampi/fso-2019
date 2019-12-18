
const initialState = { message: '', warning: false }

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'NOTIFICATION':
            return action.data
        case 'CLEAR':
            return initialState
        default:
            return state
    }
}

export default reducer

export const setNotification = (message, warning, seconds) => {
    return async (dispath) => {
        dispath({
            type: 'NOTIFICATION',
            data: { message, warning: warning }
        })
        setTimeout(() => dispath({ type: 'CLEAR' }), seconds * 1000)
    }
}

export const clearNotification = () => ({ type: 'CLEAR' })
