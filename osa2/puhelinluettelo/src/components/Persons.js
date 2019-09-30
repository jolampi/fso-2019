import React from 'react'

const Persons = ({ persons, filter }) => {
    const filterL = filter.toLowerCase()
    const filteredPersons = persons.filter(person =>
        person.name.toLowerCase().includes(filterL)
    )

    const mapPersons = () => filteredPersons.map(person =>
        <div key={person.name}>{person.name} {person.number}</div>
    )

    return (
        <div>
            {mapPersons()}
        </div>
    )
}

export default Persons
