import React, { useState, useEffect } from 'react';
import axios from 'axios'

import Filter from './components/Filter'
import Countries from './components/Countries'

const App = () => {
    const [ filter, setFilter ] = useState('')
    const [ countries, setCountries ] = useState([])

    useEffect(() => {
        axios
            .get('https://restcountries.eu/rest/v2/all')
            .then(response => setCountries(response.data))
    }, [])

    const filterChangeHandler = (event) => setFilter(event.target.value)
    const autoFillerHandler = (event) => setFilter(event.target.value)

    return (
        <div>
            <Filter value={filter} onChange={filterChangeHandler} />
            <Countries countries={countries} filter={filter} onAutoFiller={autoFillerHandler} />
        </div>
    )
}

export default App;
