const { decodeToken } = require('../lib/token')
const User = require('../models/user')

const isLoggedIn = (req, _res, next) => {
    if (!req.token) {
        const error = new Error('You are not logged in. Please try logging in.')
        error.status = 400
        return next(error)
    }

    try {
        decodeToken(req.token)
        next()
    } catch (e) {
        console.error(e)
        const error = new Error('Something went wrong with your credentials. Please try again.')
        error.status = 401
        next(error)
    }
}

const isSameUser = (req, _res, next) => {
    const id = req.params.studentId
    const token = decodeToken(req.token)
    if (token.id === id) return next()
  
    const error = new Error('You are not authorized to access this route.')
    error.status = 401
    next(error)
}

const isAdmin = async (req, _res, next) => {
    const token = decodeToken(req.token)
    const id = token.id
    const adminUser = await User.findById(id).select('-__v -password')
    if (adminUser.admin === true) return next()
  
    const error = new Error('You need to be an admin to access this route.')
    error.status = 401
    next(error)
}

module.exports = { isLoggedIn, isSameUser, isAdmin }