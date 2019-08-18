const router = require('express').Router()
const Assignment = require('../models/assignment')
const { isLoggedIn, isSameUser } = require('../middleware/auth')

// get ungraded assignments - needs isAdmin middleware
router.get('/', isLoggedIn, isSameUser, async (req, res, next) => {
    const status = 200
    const response = await Assignment.find({ graded: false }).select('-__v')

    res.json({ status, response })
})

// get graded assignments - needs isAdmin middleware

// patch/update grades

module.exports = router