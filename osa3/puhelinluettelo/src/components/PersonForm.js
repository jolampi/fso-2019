import React from 'react'

const PersonForm = ({ onSubmit, nameValue, numberValue, onNameChange, onNumberChange }) => (
    <form onSubmit={onSubmit}>
        name: <input value={nameValue} onChange={onNameChange} /><br />
        number: <input value={numberValue} onChange={onNumberChange} /><br />
        <button type="submit">add</button>
    </form>
)

export default PersonForm
