import React from 'react'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = ({ store }) => {

    const create = (event) => {
        event.preventDefault()
        const anecdote = event.target.anecdote.value
        console.log('create', anecdote)
        store.dispatch(createAnecdote(anecdote))
        store.dispatch(setNotification(`created anecdote '${anecdote}'`))
        setTimeout(() => store.dispatch(setNotification('')), 5000)
        event.target.anecdote.value = ''
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

export default AnecdoteForm
