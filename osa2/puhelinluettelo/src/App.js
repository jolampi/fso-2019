import React, { useState, useEffect } from 'react'

import personService from './services/persons'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ filter, setFilter ] = useState('')
    const [ persons, setPersons] = useState([])

    useEffect(() => {
        personService.getAll().then(initialPersons => setPersons(initialPersons))
    }, [])

    const deleteContactOf = (deletePerson) => {
        if (window.confirm(`Delete ${deletePerson.name}?`)) {
            personService.remove(deletePerson.id).then(() => {
                setPersons(persons.filter(person => person.id !== deletePerson.id))
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
                    setNewName('')
                    setNewNumber('')
                })
        } else if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
            personService
                .update(existingPerson.id, { ...existingPerson, number: newNumber })
                .then(updatedPerson => {
                    console.log('hello')
                    setPersons(persons.map(person => person.id !== updatedPerson.id ? person : updatedPerson))
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
