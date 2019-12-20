import { setNotification } from './notificationReducer'
import loginService from '../services/login'

const reducer = (state = null, action) => {
    switch(action.type) {
        case 'SET_USER':
            return action.data
        case 'CLEAR_USER':
            return null
        default:
            return state
    }
}

export default reducer

export const login = (username, password) => {
    return async (dispatch) => {
        try {
            const data = await loginService.login({ username, password })
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(data))
            dispatch({ type: 'SET_USER', data })
            dispatch(setNotification('succesfully logged in', false, 10))
        } catch (exception) {
            dispatch(setNotification('wrong username or password', true, 10))
        }
    }
}

export const logout = () => {
    return async (dispatch) => {
        window.localStorage.clear()
        dispatch({ type: 'CLEAR_USER' })
    }
}

export const setSessionUser = (data) => ({ type: 'SET_USER', data })
