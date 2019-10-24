import React from 'react'

const Persons = ({ persons, filter, deleteContactOf }) => {
    const filterL = filter.toLowerCase()
    const filteredPersons = persons.filter(person =>
        person.name.toLowerCase().includes(filterL)
    )

    const mapPersons = () => filteredPersons.map(person =>
        <div key={person.id}>
            {person.name} {person.number}
            <button onClick={() => deleteContactOf(person)}>delete</button>
        </div>
    )

    return (
        <div>
            {mapPersons()}
        </div>
    )
}

export default Persons
