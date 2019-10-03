const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    email: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    profession: {
        type: String
    },
    bio: {
        type: String
    },
    status: {
        type: String
    },
    startingweight: {
        type: String 
    },
    goalweight: {
        type: String
    },
    social: {
        facebook: {
            type: String
        },
        twitter: {
            type: String
        },
        instagram: {
            type: String
        },
        youtube: {
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Profile = mongoose.model('profile', ProfileSchema)