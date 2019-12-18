import React from 'react'
import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setFilter } from '../reducers/filterReducer'
import { setNotification } from '../reducers/notificationReducer'
import noteService from '../services/anecdotes'

const AnecdoteForm = (props) => {

    const create = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        const newAnecdote = await noteService.create(content)
        props.createAnecdote(newAnecdote)
        props.setFilter()
        props.setNotification(`created anecdote '${content}'`)
        setTimeout(() => props.setNotification(''), 5000)
    }

    return(
        <div>
            <h2>create new</h2>
            <form onSubmit={create}>
                <div><input name="anecdote" /></div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default connect(
    null,
    { createAnecdote, setFilter, setNotification }
)(AnecdoteForm)
