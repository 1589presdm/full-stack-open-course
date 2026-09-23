import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import axios from 'axios'
import { useEffect } from 'react'


const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilter] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3001/persons').then(response => {
      setPersons(response.data)
    })
  }, [])

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
      <Filter value={filterValue} onChange={handleFilterChanged} />

      <h2>Add a new contact</h2>
      <PersonForm
        onSubmit={addContact}
        nameValue={newName}
        onNameChange={handleContactChanged}
        numberValue={newNumber}
        onNumberChange={handleNumberChanged} />

      <h2>Numbers</h2>
      <Persons personsToShow={filteredPersons} />
    </div>
  )
}


export default App