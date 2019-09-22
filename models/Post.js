const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true
    }, 
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [
        {
        user: {
            type: Schema.Types.ObjectId,
            ref: "users"
        }

        }
    ], 
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "users"
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],

// Date of the Post itself, not the comment, above is Date of the comment
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Post = mongoose.model('post', PostSchema)