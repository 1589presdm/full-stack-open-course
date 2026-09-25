import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'
import Notification from './components/Notification'
import { useEffect } from 'react'


const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilter] = useState('')
  const [successfulMessage, setSuccessfulMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personsService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])


  const addContact = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name === newName)
    if (existingPerson) {
      const ok = window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)
      if (ok) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        personsService.update(existingPerson.id, updatedPerson).then(returnedPerson => {
          setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
          setNewName('')
          setNewNumber('')
          setSuccessfulMessage(`Changed number for ${returnedPerson.name}.`)
          setTimeout(() => {
            setSuccessfulMessage(null)
          }, 5000)
        })
          .catch(error => {
            setErrorMessage(`Information of ${existingPerson.name} has already been removed from server.`)
            setTimeout(() => { setErrorMessage(null) }, 5000)
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
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
      setSuccessfulMessage(`Added ${returnedPerson.name}`)
      setTimeout(() => {
        setSuccessfulMessage(null)
      }, 5000)
    })

  }

  const deleteContact = (id) => {
    const person = persons.find(p => p.id === id)

    const ok = window.confirm(`Delete ${person.name}?`)
    if (ok) {
      personsService.deleteContact(id).then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
      .catch(error => {
        setErrorMessage(`Information of ${person.name} has already been removed from server.`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
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
      <Notification message={successfulMessage || errorMessage}
        type = {errorMessage ? 'error' : 'success'} />
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
        handleDelete={deleteContact} />
    </div>
  )
}


export default App