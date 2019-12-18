import React from 'react'
import { incrementVotes } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = ({ store }) => {
    const anecdotes = store.getState().anecdotes
    const filter = store.getState().filter
    console.log(store.getState())

    const vote = (anecdote) => {
        store.dispatch(incrementVotes(anecdote.id))
        store.dispatch(setNotification(`you voted '${anecdote.content}'`))
        setTimeout(() => store.dispatch(setNotification('')), 5000)
    }

    return (
        <div>
            {anecdotes
                .filter(anecdote => anecdote.content.toLowerCase().includes(filter))
                .sort((a1, a2) => a2.votes - a1.votes)
                .map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList
