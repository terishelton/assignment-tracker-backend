const router = require('express').Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const Assignment = require('../models/assignment')
const { isLoggedIn, isSameUser, isAdmin } = require('../middleware/auth')

// get all students (not all users!)
router.get('/', isLoggedIn, async (req, res, next) => {
    const status = 200
    const response = await User.find({ admin: false }).select('-__v -password')
    res.json({ status, response })
})

// get all assignments for studentId
router.get('/:studentId/assignments', isLoggedIn, isSameUser, async (req, res, next) => {
    const status = 200
    const response = await Assignment
        .find()
        .where('student').equals(req.params.studentId)
        .select('title description link userScore totalPossible graded')
    
    res.json({ status, response })
})

// create assignment
router.post('/:studentId/assignment', isLoggedIn, isSameUser, async (req, res, next) => {
    const status = 201
    const assignment = await Assignment.create({
        _id: new mongoose.Types.ObjectId(), 
        title: req.body.title,
        description: req.body.description,
        link: req.body.link,
        graded: false,
        student: req.params.studentId
    })

    await assignment.save()

    res.json({ status, response: assignment })
})

// edit assignment
router.patch('/:studentId/assignment/:assignmentId', isLoggedIn, isSameUser, async (req, res, next) => {
    const status = 201

    // get the assignemnt
    const assignment = await Assignment.findOne({ _id: req.params.assignmentId })

    // update the assignment
    assignment.set(req.body)
    await assignment.save()

    // return updated assignment
    res.json({ status, response: assignment })
})

// delete assignment
router.delete('/:studentId/assignment/:assignmentId', isLoggedIn, isSameUser, async (req, res, next) => {
    const status = 200
    const assignment = await Assignment
        .findOne({ _id: req.params.assignmentId })
        .populate('student', '_id')
        .select('userScore totalPossible student')

    // get score values so we can update overall score
    const originalScore = assignment.userScore
    const originalPossible = assignment.totalPossible

    const student = await User.findOne({ _id: assignment.student[0]._id })

    // remove the assignment and save it
    assignment.remove()
    await assignment.save()

    // update the student's overall score
    student.overallGrade = parseInt(student.overallGrade) - parseInt(originalScore)
    student.overallGradePossible = parseInt(student.overallGradePossible) - parseInt(originalPossible)
    await student.save()

    res.json({ status, response: assignment })
})

module.exports = router