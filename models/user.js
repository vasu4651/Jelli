const mongoose = require('mongoose');
const Story = require('./story');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    stories: [{type: mongoose.Schema.Types.ObjectId, ref:'Story'}]
});


const User = mongoose.model('User', userSchema);
module.exports = User;