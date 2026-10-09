const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogNotes')


const app = express()

mongoose.connect(config.MONGODB_URI, { family: 4 })
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch(error => {
        logger.error('error conneting to MongoDB', error.message)
    })

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app


