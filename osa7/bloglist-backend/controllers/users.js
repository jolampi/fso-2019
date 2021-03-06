const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('blogs', { url: 1, title: 1, author: 1 })
    response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {

    try {
        const body = request.body

        if (body.password === undefined) {
            throw {
                name: 'ValidationError',
                message: 'User validation failed: password: Path `password` is required.'
            }
        } else if (body.password.length < 3) {
            throw {
                name: 'ValidationError',
                message: `User validation failed: password: Path \`password\` (\`${body.password}\`) is shorter than the minimum allowed length (3).`
            }
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash
        })

        const savedUser = await user.save()

        response.json(savedUser)
    } catch (exception) {
        next(exception)
    }
})

module.exports = usersRouter
