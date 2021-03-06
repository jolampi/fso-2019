import blogService from '../services/blogs'

const reducer = (state = [], action) => {
    switch(action.type) {
        case 'CREATE_BLOG':
            return state.concat(action.data)
        case 'UPDATE_BLOG':
            return state.map(blog =>
                (blog.id !== action.data.id) ? blog : action.data
            )
        case 'REMOVE_BLOG':
            return state.filter(blog => blog.id !== action.data)
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

export const createBlog = (blogObject, token, callback) => {
    return async (dispatch) => {
        let success = true
        let error = null
        try {
            const data = await blogService.create(blogObject, token)
            dispatch({ type: 'CREATE_BLOG', data })
        } catch(exception) {
            success = false
            error = exception.response.data.error
        }
        if (callback) { callback(success, error) }
    }
}

export const createComment = (blogId, comment, callback) => {
    return async (dispatch) => {
        let success = true
        let error = null
        try {
            const data = await blogService.createComment(blogId, { comment })
            dispatch({ type: 'UPDATE_BLOG', data })
        } catch(exception) {
            success = false
            error = exception.response.data.error
            if (exception.response.status === 410) {
                dispatch({ type: 'REMOVE_BLOG', data: blogId })
            }
        }
        if (callback) { callback(success, error) }
    }
}

export const incrementLikes = (blogToUpdate, callback) => {
    return async (dispatch) => {
        let success = true
        try {
            const newObject = { ...blogToUpdate,  likes: blogToUpdate.likes + 1 }
            delete newObject.id
            const data = await blogService.update(blogToUpdate.id, newObject)
            dispatch({ type: 'UPDATE_BLOG', data })
        } catch(exception) {
            success = false
            dispatch({ type: 'REMOVE_BLOG', data: blogToUpdate.id })
        }
        if (callback) { callback(success) }
    }
}

export const removeBlog = (blogToRemove, token, callback) => {
    return async (dispatch) => {
        let success = true
        try {
            await blogService.remove(blogToRemove.id, token)
            dispatch({ type: 'REMOVE_BLOG', data: blogToRemove.id })
        } catch(exception) {
            success = false
            if (exception.response.status !== 401) {
                dispatch({ type: 'REMOVE_BLOG', data: blogToRemove.id })
            }
        }
        if (callback) { callback(success) }
    }
}
