const mongoose = require('mongoose')

// const Schema = mongoose.Schema
// const ObjectId = mongoose.Schema.Types.ObjectId;


const ExerciseSchema = new mongoose.Schema({
     user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    workout: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'workout'
    },
    name: {
        type: String,
        required: true
    },
    set: {
        type:String,
        required: true
    },
    rep: {
        type: String,
        required:true
    },
    weight: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
   
    


    
})

module.exports = Exercise = mongoose.model('exercise', ExerciseSchema)