const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FoodSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String,
        required: true
    }, 

    calories: {
        type: Number,
        required: true 
    }

})
const Food = mongoose.model('food', FoodSchema)

module.exports = Food