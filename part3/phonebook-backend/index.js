const express = require('express')
const phonebook = express()
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()
const Contact = require('./models/persons')


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

phonebook.get('/api/persons/:id', (request, response) => {
    Contact.findById(request.params.id).then(person => {
            if (person) {
                response.json(person)
            }
            else {
                response.status(404).end()
            }
    })
})

phonebook.delete('/api/persons/:id', (request, response) => {
    Contact.findByIdAndDelete(request.params.id).then(() => {
        response.status(204).end()
    })
})

phonebook.post('/api/persons', (request, response) => {
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
})

const PORT = process.env.PORT 
phonebook.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

