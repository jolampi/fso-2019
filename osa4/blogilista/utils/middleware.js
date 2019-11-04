const morgan = require('morgan')
morgan.token('body', function (request) {
    const str = JSON.stringify(request.body)
    return (str !== '{}' ) ? str : ' '
})

const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

module.exports = { requestLogger }
