const router = require('express').Router()
const User = require('../models/user')
const Assignments = require('../models/assignment')
const { isLoggedIn, isAdmin } = require('../middleware/auth')

// get ungraded assignments
router.get('/ungraded', isLoggedIn, isAdmin, async (req, res, next) => {
    const status = 200
    const response = await Assignments
        .find()
        .populate('student', 'firstName lastName email')
        .select('title description link graded student')
        .where('graded').equals(false)

    res.json({ status, response })
})

// get graded assignments
router.get('/graded', isLoggedIn, isAdmin, async (req, res, next) => {
    const status = 200
    const response = await Assignments
        .find()
        .populate('student', 'firstName lastName')
        .select('title description link graded student')
        .where('graded').equals(true)

    res.json({ status, response })
})

// patch/update grades
router.patch('/', isLoggedIn, isAdmin, async (req, res, next) => {
    // do something here
})

module.exports = router