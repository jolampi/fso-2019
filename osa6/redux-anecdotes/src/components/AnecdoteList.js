import React from 'react'
import { incrementVotes } from '../reducers/anecdoteReducer'

const AnecdoteList = ({ store }) => {
    const anecdotes = store.getState()

    const vote = (id) => {
        console.log('vote', id)
        store.dispatch(incrementVotes(id))
    }

    return (
        <div>
            <h2>Anecdotes</h2>
            {anecdotes
                .sort((a1, a2) => a2.votes - a1.votes)
                .map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList
