import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import blogReducer from './reducers/blogReducer'
import notificationReducer from './reducers/notificationReducer'
import loginReducer from './reducers/loginReducer'

const reducer = combineReducers({
    blogs: blogReducer,
    notification: notificationReducer,
    user: loginReducer
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store
