const { CLIENT_BASE_URL, MONGO_DB_CONNECTION, NODE_ENV, PORT } = process.env
const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')

// Set up DB connection
if (MONGO_DB_CONNECTION) {
    mongoose.connect(MONGO_DB_CONNECTION, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
    console.log('Connected to database...')
} else {
    console.log('Could not connect to the database!')
}

// Application-level Middleware
if (NODE_ENV === 'development') app.use(require('morgan')('dev'))
app.use(require('body-parser').json())

// Set up CORS
app.use(cors({
    origin: CLIENT_BASE_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

// Attach token to request
app.use(require('./api/middleware/get-token'))

// Routes
app.use('/api', require('./api/routes/auth')) // login and signup
app.use('/api/students', require('./api/routes/students')) // student routes
app.use('/api/assignments', require('./api/routes/assignments')) // assignment routes

// Not Found Handler
app.use((req, res, next) => {
    const error = new Error(`Could not ${req.method} ${req.path}`)
    error.status = 404
    next(error)
})
  
// Error Handler
app.use((err, req, res, next) => {
    if (NODE_ENV === 'development') console.error(err)
    const { message, status } = err
    res.status(status).json({ status, message })
})

// Open Connection
const listener = () => console.log(`Listening on Port ${PORT}!`)
app.listen(PORT, listener)