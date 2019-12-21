const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: String,
    url: {
        type: String,
        required: true
    },
    likes: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            comment: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: true
            }
        }
    ]
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        returnedObject.comments.forEach(comment => {
            comment.id = comment._id.toString()
            delete comment._id
        })
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)
