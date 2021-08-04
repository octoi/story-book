const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private'],
    },
    // user: {
    //     id: mongoose.Schema.Types.ObjectId,
    //     googleId: String,
    //     displayName: String,
    //     firstName: String,
    //     lastName: String,
    //     image: String,
    //     createdAt: Date
    // },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Story', StorySchema)