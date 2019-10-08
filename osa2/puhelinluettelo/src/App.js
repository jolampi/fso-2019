import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ filter, setFilter ] = useState('')
    const [ persons, setPersons] = useState([])

    useEffect(() => {
        axios
            .get('http://localhost:3001/persons')
            .then(response => setPersons(response.data))
    }, [])

    const newNameHandler = (event) => {
        event.preventDefault()
        let exists = false
        persons.forEach(person => {
            if (person.name === newName) {
                exists = true
                /* No break statement for forEach? boo javascript */
            }
        })
        if (exists) {
            alert(`${newName} is already added to phonebook`)
        } else {
            setPersons(persons.concat({ name: newName, number: newNumber }))
            setNewName('')
            setNewNumber('')
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
                onNameChange={nameChangeHandler}
                onNumberChange={numberChangeHandler}
            />
            <h2>Numbers</h2>
            <Persons persons={persons} filter={filter} />
        </div>
    )

}

export default App
