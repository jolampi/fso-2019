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

const errorDispatch = (blog, dispatch) => {
    dispatch(setNotification(
        `the blog '${blog.title}' was already deleted from server`, true, 10
    ))
    dispatch({ type: 'FILTER_INVALID', data: blog })
}

export const initializeBlogs = () => {
    return async (dispatch) => {
        const data = await blogService.getAll()
        dispatch({ type: 'INIT_BLOGS', data })
    }
}

export const createBlog = (blogObject, token) => {
    return async (dispatch) => {
        const data = await blogService.create(blogObject, token)
        dispatch({ type: 'CREATE_BLOG', data })
    }
}

export const incrementLikes = (blogObject) => {
    return async (dispatch) => {
        try {
            const newObject = { ...blogObject,  likes: blogObject.likes + 1 }
            delete newObject.id
            const data = await blogService.update(blogObject.id, newObject)
            dispatch({ type: 'LIKE_BLOG', data })
        } catch(exeption) { errorDispatch(blogObject, dispatch) }
    }
}

export const removeBlog = (blogObject) => {
    return async (dispatch) => {
        try {
            await blogService.remove(blogObject.id, 'token')
            dispatch({ type: 'REMOVE_BLOG', blogObject })
        } catch(exeption) { errorDispatch(blogObject, dispatch) }
    }
}
