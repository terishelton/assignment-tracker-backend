const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Assignment = require('./assignment')

const personSchema = Schema({
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
    assignment: [Assignment]
},
    { 
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
    }
)

module.exports = mongoose.model('User', personSchema)