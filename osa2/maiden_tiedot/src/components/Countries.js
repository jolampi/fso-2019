import React from 'react'
import Country from './Country'

const Countries = ({ countries, filter, onAutoFiller }) => {
    const filterL = filter.toLowerCase()
    const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(filterL))

    const filteredCount = filteredCountries.length
    console.log('countries', filteredCount)

    const mapCountries = () => filteredCountries.map(country =>
        <div key={country.name}>
            {country.name}
            <button value={country.name} onClick={onAutoFiller}>show</button>
        </div>)

    if (filteredCount <= 0) {
        return <div>Not any matches, specify another filter</div>
    } else if (filteredCount === 1) {
        return <Country country={filteredCountries[0]} />
    } else if (filteredCount <= 10) {
        return <div>{mapCountries()}</div>
    } else {
        return <div>Too many matches, specify another filter</div>
    }
}

export default Countries
