import React, { useState, useEffect } from 'react'

import personService from './services/persons'

import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
    const MESSAGE_TIMEOUT = 6000

    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ filter, setFilter ] = useState('')
    const [ persons, setPersons] = useState([])
    const [ statusMessage, setStatusMessage ] = useState(null)
    const [ statusWarning, setStatusWarning ] = useState(false)

    useEffect(() => {
        personService.getAll().then(initialPersons => setPersons(initialPersons))
    }, [])

    const deleteContactOf = (deletePerson) => {
        if (window.confirm(`Delete ${deletePerson.name}?`)) {
            personService.remove(deletePerson.id)
            .then(() => {
                setPersons(persons.filter(person => person.id !== deletePerson.id))
                setStatusMessage(`Deleted ${deletePerson.name}`)
                setTimeout(() => setStatusMessage(null), MESSAGE_TIMEOUT)
            })
            .catch(error => {
                setStatusWarning(true)
                setStatusMessage(`Information of ${deletePerson.name} has already been deleted from server`)
                setTimeout(() => {
                    setStatusWarning(false)
                    setStatusMessage(null)
                }, MESSAGE_TIMEOUT)
            })
        }
    }

    const newNameHandler = (event) => {
        event.preventDefault()
        const existingPerson = persons.find(person => person.name === newName)
        if (existingPerson === undefined) {
            personService
                .create({ name: newName, number: newNumber })
                .then(newPerson => {
                    setPersons(persons.concat(newPerson))
                    setStatusMessage(`Added ${newPerson.name}`)
                    setTimeout(() => setStatusMessage(null), MESSAGE_TIMEOUT)
                    setNewName('')
                    setNewNumber('')
                })
        } else if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
            personService
                .update(existingPerson.id, { ...existingPerson, number: newNumber })
                .then(updatedPerson => {
                    setPersons(persons.map(person => person.id !== updatedPerson.id ? person : updatedPerson))
                    setStatusMessage(`Updated ${updatedPerson.name}`)
                    setTimeout(() => setStatusMessage(null), MESSAGE_TIMEOUT)
                    setNewName('')
                    setNewNumber('')
                })
        }
    }

    const nameChangeHandler = (event) => setNewName(event.target.value)
    const numberChangeHandler = (event) => setNewNumber(event.target.value)
    const filterChangeHandler = (event) => setFilter(event.target.value)

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={statusMessage} warning={statusWarning} />
            <Filter value={filter} onChange={filterChangeHandler} />
            <h2>add a new</h2>
            <PersonForm
                onSubmit={newNameHandler}
                nameValue={newName}
                numberValue={newNumber}
                onNameChange={nameChangeHandler}
                onNumberChange={numberChangeHandler}
            />
            <h2>Numbers</h2>
            <Persons persons={persons} filter={filter} deleteContactOf={deleteContactOf} />
        </div>
    )

}

export default App
