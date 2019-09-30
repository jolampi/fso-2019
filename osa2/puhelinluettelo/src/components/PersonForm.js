import React from 'react'

const PersonForm = ({ onSubmit, onNameChange, onNumberChange }) => (
    <form onSubmit={onSubmit}>
        name: <input onChange={onNameChange} /><br />
        number: <input onChange={onNumberChange} /><br />
        <button type="submit">add</button>
    </form>
)

export default PersonForm
