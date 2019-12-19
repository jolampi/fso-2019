import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const reducer = (state = [], action) => {
    switch(action.type) {
        case 'CREATE_BLOG':
            return state.concat(action.data)
        case 'LIKE_BLOG':
            return state.map(blog =>
                (blog.id !== action.data.id) ? blog : action.data
            )
        case 'REMOVE_BLOG':
        case 'FILTER_INVALID':
            return state.filter(blog => blog.id !== action.data.id)
        case 'INIT_BLOGS':
            return action.data
        default:
            return state
    }
}

export default reducer

export const initializeBlogs = () => {
    return async (dispatch) => {
        const data = await blogService.getAll()
        dispatch({ type: 'INIT_BLOGS', data })
    }
}

export const createBlog = (blogObject, token) => {
    return async (dispatch) => {
        try {
            const data = await blogService.create(blogObject, token)
            dispatch({ type: 'CREATE_BLOG', data })
            dispatch(setNotification(`a new blog ${blogObject.title} added`, false, 10))
        } catch(exception) { dispatch(setNotification(exception.response.data.error, true, 10)) }
    }
}

const handleMissingFromServer = (blog, dispatch) => {
    dispatch(setNotification(
        `the blog '${blog.title}' was already deleted from server`, true, 10
    ))
    dispatch({ type: 'FILTER_INVALID', data: blog })
}

export const incrementLikes = (blogToUpdate, callback) => {
    let result = true
    return async (dispatch) => {
        try {
            const newObject = { ...blogToUpdate,  likes: blogToUpdate.likes + 1 }
            delete newObject.id
            const data = await blogService.update(blogToUpdate.id, newObject)
            dispatch({ type: 'LIKE_BLOG', data })
        } catch(exception) {
            result = false
            handleMissingFromServer(blogToUpdate, dispatch)
        }
        if (callback) { callback(result) }
    }
}

export const removeBlog = (blogToRemove, token, callback) => {
    let result = true
    return async (dispatch) => {
        try {
            await blogService.remove(blogToRemove.id, token)
            dispatch({ type: 'REMOVE_BLOG', data: blogToRemove })
            dispatch(setNotification(`Removed '${blogToRemove.title}'`, false, 10))
        } catch(exception) {
            result = false
            // console.log(exception.response)
            if (exception.response.status === 401) {
                dispatch(
                    setNotification('You don\t have a permission to remove this blog', true, 10)
                )
            } else {
                handleMissingFromServer(blogToRemove, dispatch)
            }
        }
        if (callback) { callback(result) }
    }
}
