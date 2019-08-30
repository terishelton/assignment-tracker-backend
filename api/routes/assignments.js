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
        .select('title description link graded userScore totalPossible student')
        .where('graded').equals(false)

    res.json({ status, response })
})

// get graded assignments
router.get('/graded', isLoggedIn, isAdmin, async (req, res, next) => {
    const status = 200
    const response = await Assignments
        .find()
        .populate('student', 'firstName lastName')
        .select('title description link graded userScore totalPossible student')
        .where('graded').equals(true)

    res.json({ status, response })
})

// patch/update grades
router.patch('/grade/:assignmentId', isLoggedIn, isAdmin, async (req, res, next) => {
    const status = 201

    // get the assignemnt
    const assignment = await Assignments
        .findOne({ _id: req.params.assignmentId })
        .populate('student', '_id')
        .select('title description link graded userScore totalPossible student')

    const student = await User.findOne({ _id: assignment.student[0]._id })

    // assignment is already graded (updating/patching the grade)
    if (assignment.userScore > 0) {
        // update the assignment
        const originalScore = assignment.userScore
        const originalPossible = assignment.totalPossible

        assignment.userScore = req.body.assignment.userScore
        assignment.totalPossible = req.body.assignment.totalPossible
        await assignment.save()

        // update the student's overall score
        student.overallGrade = parseInt(student.overallGrade) - parseInt(originalScore) + parseInt(req.body.assignment.userScore)
        student.overallGradePossible = parseInt(student.overallGradePossible) - parseInt(originalPossible) + parseInt(req.body.assignment.totalPossible)
        await student.save()
    // assignment hasn't been graded yet
    } else {
        // update the assignment
        assignment.graded = true
        assignment.userScore = req.body.assignment.userScore
        assignment.totalPossible = req.body.assignment.totalPossible
        await assignment.save()

        // update the student's overall score
        student.overallGrade = parseInt(student.overallGrade) + parseInt(req.body.assignment.userScore)
        student.overallGradePossible = parseInt(student.overallGradePossible) + parseInt(req.body.assignment.totalPossible)
        await student.save()
    }

    // return updated assignment
    res.json({ status, response: assignment })
})

module.exports = router