const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    return response.status(204).end()
})

router.post('/reset/blogs', async (request, response) => {
    await Blog.deleteMany({})

    return response.status(204).end()
})

module.exports = router
