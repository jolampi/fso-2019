const Blog = require('../models/blog')

const initialBlogs = require('./test_blogs').list_n

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, blogsInDb }
