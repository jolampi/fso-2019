import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import blogFilter from './reducers/blogReducer'
import notificationFilter from './reducers/notificationReducer'

const reducer = combineReducers({
    blogs: blogFilter,
    notification: notificationFilter
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store
