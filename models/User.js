const mongoose = require('mongoose')

// const Schema = new mongoose.Schema

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        // minlength: 3
    },
    email: {
        type: String,
        required: true, 
        unique: true
    }, 
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }, 
    date: {
        type: Date,
        default: Date.now
    }
})


module.exports = User = mongoose.model('user', UserSchema)