import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import notificationFilter from './reducers/notificationReducer'

const reducer = combineReducers({
    notification: notificationFilter
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store
