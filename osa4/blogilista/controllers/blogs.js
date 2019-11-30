const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogRouter.post('/', async (request, response, next) => {
    const body = request.body

    if (body.title === undefined || body.url === undefined) {
        response.status(400).end()
    }

    const blog = new Blog({
        author: body.author,
        title: body.title,
        url: body.url,
        likes: (body.likes) ? body.likes : 0
    })

    try {
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog.toJSON())
    } catch(exception) {
        next(exception)
    }
})

module.exports = blogRouter
