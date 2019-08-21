const router = require('express').Router()
const User = require('../models/user')
const Assignment = require('../models/assignment')
const { isLoggedIn, isAdmin } = require('../middleware/auth')

// get ungraded assignments
router.get('/ungraded', isLoggedIn, isAdmin, async (req, res, next) => {
    const status = 200
    const assignments = await User.find()
        .where('assignment.graded').ne(false) // this part doesn't work
        .select('-__v -password')

    // use population?
    // https://mongoosejs.com/docs/populate.html
    // this isn't set up right

    res.json({ status, response: assignments })
})

// get graded assignments
router.get('/graded', isLoggedIn, isAdmin, async (req, res, next) => {
    // do something here
})

// patch/update grades
router.patch('/', isLoggedIn, isAdmin, async (req, res, next) => {
    // do something here
})

module.exports = router