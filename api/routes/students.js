const router = require('express').Router()
const User = require('../models/user')
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
    const studentId = { _id: req.params.studentId }
    const response = await User.findOne(studentId).select('assignment')

    res.json({ status, response })
})

// create assignment
router.post('/:studentId/assignment', isLoggedIn, isSameUser, async (req, res, next) => {
    const status = 201
    const studentId = { _id: req.params.studentId }
    const student = await User.findOne(studentId).select('-__v -password')
    
    student.assignment.push(req.body)
    await student.save()
    
    const newAssignment = student.assignment[student.assignment.length - 1]
    res.json({ status, response: newAssignment })
})

// edit assignment
router.patch('/:studentId/assignment/:assignmentId', isLoggedIn, isSameUser, async (req, res, next) => {
    const status = 201
    const studentId = { _id: req.params.studentId }

    // get the student
    const student = await User.findOne(studentId).select('-__v -password')

    // get the assignemnt
    const assignment = student.assignment.id({ _id: req.params.assignmentId })

    // update the assignemnt
    assignment.set(req.body)
    await student.save()

    // get updated assignment
    const updatedAssignment = student.assignment.id({ _id: req.params.assignmentId })

    // return updated assignment
    res.json({ status, response: updatedAssignment })
})

// delete assignment
router.delete('/:studentId/assignment/:assignmentId', isLoggedIn, isSameUser, async (req, res, next) => {
    const status = 200
    const studentId = { _id: req.params.studentId }
    const assignmentId = { _id: req.params.assignmentId }

    // get the student
    const student = await User.findOne(studentId).select('-__v -password')

    // get the assignment
    const assignment = student.assignment.id(assignmentId)

    assignment.remove()
    await student.save()

    res.json({ status, assignment })
})

module.exports = router