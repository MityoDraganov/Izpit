const mongoose = require('mongoose')

const IMAGE_PATTERN = /^https?:\/\//;

const itemSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        match: IMAGE_PATTERN 
    },
    age: {
        type: Number,
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
    commentList: [
        {
              userId: {
                    type: mongoose.Types.ObjectId,
                    ref: 'user'
              },
              comment: String
        }
    ],
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
})

const itemModel = mongoose.model('item', itemSchema)

module.exports = itemModel