const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = require('./test_blogs').list_n

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = { initialBlogs, blogsInDb, usersInDb }
