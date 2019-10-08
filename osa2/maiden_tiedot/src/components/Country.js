import React from 'react'

const Country = ({ country }) => {

    const languagesToList = () => country.languages.map(language =>
        <li key={language.name}>{language.name}</li>)

    return (
        <div>
            <h1>{country.name}</h1>
            <div>capital {country.capital}</div>
            <div>population {country.population}</div>
            <h2>languages</h2>
            <ul>
                {languagesToList()}
            </ul>
            <img src={country.flag} alt="country flag" height="128" />
        </div>
    )
}

export default Country
