import React from 'react'
import { connect } from 'react-redux'
import { incrementVotes } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = (props) => {
    const vote = (anecdote) => {
        props.incrementVotes(anecdote.id)
        props.setNotification(`you voted '${anecdote.content}'`)
        setTimeout(() => props.setNotification(''), 5000)
    }

    return (
        <div>
            {props.anecdotesToShow.map(anecdote =>
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

const anecdotesToShow = (anecdotes, filter) => (
    anecdotes
        .filter(anecdote => anecdote.content.toLowerCase().includes(filter))
        .sort((a1, a2) => a2.votes - a1.votes)
)

const mapStateToProps = (state) => ({
    anecdotesToShow: anecdotesToShow(state.anecdotes, state.filter)
})

export default connect(
    mapStateToProps,
    { incrementVotes, setNotification },
)(AnecdoteList)
