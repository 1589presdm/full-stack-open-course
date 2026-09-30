const express = require('express')
const phonebook = express()

let contacts = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

phonebook.use(express.json())

phonebook.get('/api/persons', (request, response) => {
    response.json(contacts)
})

phonebook.get('/info', (request, response) =>{
    response.send(`<p>Phonebook has info for ${contacts.length} people</p>
        <p>${new Date().toString()}</p>`)
})

phonebook.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = contacts.find(person => person.id === id)

    if(person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

phonebook.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    contacts = contacts.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = contacts.length > 0 ? Math.max(...contacts.map(c => Number(c.id))) : 0
    return String(maxId + 1)
}

phonebook.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number is missing'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    contacts = contacts.concat(person)

    response.json(person)
})

const PORT = 3001
phonebook.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

