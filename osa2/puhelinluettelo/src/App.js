import React, { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
    const [ persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '040-123456' },
        { name: 'Ada Lovelace', number: '39-44-5323523' },
        { name: 'Dan Abramov', number: '12-43-234345' },
        { name: 'Mary Poppendieck', number: '39-23-6423122' }
    ]) 
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ filter, setFilter ] = useState('')

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