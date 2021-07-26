const mongoose = require('mongoose');
const User = require('./user');

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    text: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: String
    },
    user: {
        type: mongoose.Schema.ObjectId, 
        ref: 'User'
    }
})

const Story = mongoose.model('Story', storySchema);

module.exports = Story;