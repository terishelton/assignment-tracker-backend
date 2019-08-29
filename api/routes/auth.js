const router = require('express').Router()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../models/user')
const { decodeToken, generateToken } = require('../lib/token')

// Signup
router.post('/signup', async (req, res, next) => {
    const status = 201
    try {
        const { email, password, firstName, lastName } = req.body

        const newUser = await User.findOne({ email })
        if (newUser) throw new Error(`User ${email} already exists.`)

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const user = await User.create({
            _id: new mongoose.Types.ObjectId(),
            email,
            firstName,
            lastName,
            password: hashedPassword,
            admin: false
        })
        const token = generateToken(user._id)
        res.status(status).json({ status, token })
    }
    catch(e) {
        console.error(e)
        const error = new Error('An error occurred on signup. Please try again.')
        error.status = 400
        next(error)
    }
})

// Login
router.post('/login', async (req, res, next) => {
    const status = 200

    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) throw new Error('User not found.')

        const compare = await bcrypt.compare(password, user.password)
        if(!compare) throw new Error('Password is invalid.')

        const response = 'You have successfully logged in.'
        const token = generateToken(user._id)
        return res.status(status).json({ status, response, token })
    }
    catch(e) {
        console.log(e)
        const error = new Error('Username or password is incorrect. Please try logging in again.')
        error.status = 400
        next(error)
    }
})

// Profile, ready to do stuff
router.get('/profile', async (req, res, next) => {
    try {
        const token = decodeToken(req.token)
        const user = await User.findOne({ _id: token.id }).select('-__v -password')
        const status = 200
        res.json({ status, user })
    }
    catch(e) {
        console.log(e)
        const error = new Error('You are not authorized to access this route.')
        error.status = 400
        next(error)
    }
})

module.exports = router