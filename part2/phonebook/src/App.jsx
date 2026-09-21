import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567'},
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilter] = useState('')

  const addContact = (event) => {
    event.preventDefault()
    const nameExsists = persons.some(person => person.name === newName)
    if (nameExsists) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    const contactObject = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1)
    }

    setPersons(persons.concat(contactObject))
    setNewName('')
    setNewNumber('')
  }

  const handleContactChanged = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChanged = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChanged = (event) => {
    setFilter(event.target.value)
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filterValue.toLowerCase()))
  

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          filter shown with <input
            value={filterValue}
            onChange={handleFilterChanged}
          />
        </div>
      </form>
      <h2>Add a new contact</h2>
      <form onSubmit={addContact}>
        <div>
          name: <input
            value={newName}
            onChange={handleContactChanged}
          />
          </div>
          <div>
            number: <input
              value={newNumber}
              onChange={handleNumberChanged}
            />
          </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {filteredPersons.map(person => (
        <p key={person.name}>{person.name} {person.number}</p>
      ))}
    </div>
  )
}

export default App