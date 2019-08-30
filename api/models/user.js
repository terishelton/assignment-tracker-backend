const mongoose = require('mongoose')
const Schema = mongoose.Schema

const personSchema = Schema({
    _id: Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    },
    overallGrade: {
        type: Number
    },
    overallGradePossible: {
        type: Number
    },
    assignment: [{ type: Schema.Types.ObjectId, ref: 'Assignment' }]
},
    { 
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
    }
)

module.exports = mongoose.model('User', personSchema)