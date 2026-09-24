import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'
import { useEffect } from 'react'


const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilter] = useState('')

  useEffect(() => {
    personsService.getAll().then(initialPersons => {
      setPersons(initialPersons)
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
      number: newNumber
    }

    personsService.create(contactObject).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })
      
  }

  const deleteContact = (id) => {
    const person = persons.find(p => p.id === id)

    const ok = window.confirm(`Delete ${person.name}?`)
    if (ok) {
      personsService.deleteContact(id).then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
    }
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
      <Persons 
        personsToShow={filteredPersons}
        handleDelete={deleteContact}/>
    </div>
  )
}


export default App