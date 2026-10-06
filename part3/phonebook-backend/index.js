const express = require('express')
const phonebook = express()
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()
const Contact = require('./models/persons')

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

    next(error)
}

phonebook.use(cors())
phonebook.use(express.static('dist'))
phonebook.use(express.json())


morgan.token('body', (request) => {
    return request.method === 'POST' ? JSON.stringify(request.body) : ''
})

phonebook.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

phonebook.get('/api/persons', (request, response) => {
    Contact.find({}).then(persons => {
        response.json(persons)
    })
})

phonebook.get('/info', (request, response) =>{
    Contact.countDocuments({}).then(count => {
        response.send(`<p>Phonebook has info for ${count} people</p>
            <p>${new Date().toString()}</p>`)
    })
})

phonebook.get('/api/persons/:id', (request, response, next) => {
    Contact.findById(request.params.id).then(person => {
            if (person) {
                response.json(person)
            }
            else {
                response.status(404).end()
            }
    })
    .catch(error => next(error))
})

phonebook.delete('/api/persons/:id', (request, response, next) => {
    Contact.findByIdAndDelete(request.params.id).then(() => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

phonebook.post('/api/persons', (request, response, next) => {
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number is missing'
        })
    } 

    const person = new Contact({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

phonebook.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body

    Contact.findByIdAndUpdate(request.params.id, {name, number}, {new: true, runValidators: true, context: 'query'}).then((updatedPerson) => {
        if (updatedPerson) {
            response.json(updatedPerson)
        }
        else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

phonebook.use(errorHandler)

const PORT = process.env.PORT 
phonebook.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

