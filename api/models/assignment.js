const mongoose = require('mongoose')
const Schema = mongoose.Schema

const assignmentSchema = Schema({
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
    totalPossible: Number,
    student: [{ type: Schema.Types.ObjectId, ref: 'User' }]
},
    { 
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
    }
)

module.exports = mongoose.model('Assignment', assignmentSchema)