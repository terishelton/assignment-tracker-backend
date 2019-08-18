const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        min: 10
    },
    link: {
        type: String,
        required: true
    },
    graded: Boolean,
    userScore: Number,
    totalPossible: Number
},
    { 
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
    }
)

module.exports = mongoose.model('Assignment', schema)