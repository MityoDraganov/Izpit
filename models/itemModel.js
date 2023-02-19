const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    commentList: [{
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }],
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
})

const itemModel = mongoose.model('item', itemSchema)

module.exports = itemModel