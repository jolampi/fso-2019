const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs.map(blog => blog.toJSON()))
})

blogRouter.post('/', async (request, response, next) => {
    const body = request.body

    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!request.token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const user = await User.findById(decodedToken.id)

        const blog = new Blog({
            user: user._id,
            author: body.author,
            title: body.title,
            url: body.url,
            likes: (body.likes) ? body.likes : 0
        })

        const savedBlog = await blog.save()
        const populatedBlog = await savedBlog
            .populate('user', { username: 1, name: 1 })
            .execPopulate()
        user.blogs = user.blogs.concat(populatedBlog._id)
        await user.save()
        response.status(201).json(populatedBlog.toJSON())
    } catch(exception) {
        next(exception)
    }
})

blogRouter.post('/:id/comments', async (request, response, next) => {
    const body = request.body
    if (!body.comment) { return response.status(400).json({ error: 'missing content' }) }

    try {
        const blog = await Blog.findById(request.params.id)
        if (blog === null) { return response.status(410).json({ error: 'invalid id' }) }

        const comment = (!body.comment) ? {} : {
            comment: body.comment,
            date: new Date()
        }

        const newComments = { comments: blog.comments.concat(comment) }
        const updatedBlog = await Blog
            .findByIdAndUpdate(request.params.id, newComments, { new: true })
            .populate('user', { username: 1, name: 1 })
        response.json(updatedBlog.toJSON())

    } catch(exception) {
        next(exception)
    }
})

blogRouter.delete('/:id', async (request, response, next) => {
    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!request.token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const blog = await Blog.findById(request.params.id)
        if (blog === null) { return response.status(410).json({ error: 'invalid id' }) }
        if (blog.user.toString() === decodedToken.id.toString()) {
            await Blog.findByIdAndRemove(request.params.id)
            return response.status(204).end()
        } else {
            return response.status(401).json({ error: 'Unauthorized document removal request' })
        }
    } catch(exception) {
        next(exception)
    }
})

blogRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {}
    if (body.likes) { blog.likes = body.likes }

    try {
        const updatedBlog = await Blog
            .findByIdAndUpdate(request.params.id, blog, { new: true })
            .populate('user', { username: 'username', name: 'name' })
        if (updatedBlog === null) { return response.status(410).json({ error: 'invalid id' }) }
        response.json(updatedBlog.toJSON())
    } catch(exception) {
        next(exception)
    }
})

module.exports = blogRouter
