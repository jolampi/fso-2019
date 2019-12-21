const logger = require('./logger')

const morgan = require('morgan')
morgan.token('body', function (request) {
    const str = JSON.stringify(request.body)
    return (str !== '{}' ) ? str : ' '
})

const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    switch(error.name) {
    case 'CastError':
        if (error.kind === 'ObjectId') {
            return response.status(400).send({ error: 'malformed id' })
        }
        break
    case 'ValidationError':
        return response.status(400).send({ error: error.message })
    case 'JsonWebTokenError':
        return response.status(401).json({ error: 'invalid token' })
    default:
        next(error)
    }
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    }
    next()
}

module.exports = {
    requestLogger,
    errorHandler,
    tokenExtractor,
    unknownEndpoint
}
