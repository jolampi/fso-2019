const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('./utils/config')
const cors = require('cors')
const blogRouter = require('./controllers/blogs')
const mongoose = require('mongoose')

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to MongoDB'))
    .catch(error => console.error('error connecting to MongoDB:', error.message))

app.use(cors())
app.use(bodyParser.json())

app.use('/api/blogs', blogRouter)

module.exports = app
