const mongoose = require('mongoose');

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
    }
})

const Story = mongoose.model('Story', storySchema);

module.exports = Story;