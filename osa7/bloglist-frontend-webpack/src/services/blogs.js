import axios from 'axios'
const baseUrl = `${BACKEND_URL}/api/blogs`

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const create = async (newObject, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` }
    }
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const createComment = async (id, commentObject) => {
    const response = await axios.post(`${baseUrl}/${id}/comments`, commentObject)
    return response.data
}

const update = async (id, newObject) => {
    const response = await axios.put(`${baseUrl}/${id}`, newObject)
    return response.data
}

const remove = async (id, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` }
    }
    await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, createComment, update, remove }
