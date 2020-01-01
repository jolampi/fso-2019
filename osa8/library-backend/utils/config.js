require('dotenv').config()

let JWT_SECRET = process.env.JWT_SECRET
let MONGODB_URI = process.env.MONGODB_URI
let PORT = process.env.PORT

module.exports = {
    JWT_SECRET,
    MONGODB_URI,
    PORT
}
