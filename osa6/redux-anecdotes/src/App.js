import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { initializeAnecdotes } from './reducers/anecdoteReducer'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'
import anecdoteService from './services/anecdotes'

const App = (props) => {
    useEffect(() => {
        const effect = async () => {
            const anecdotes = await anecdoteService.getAll()
            props.initializeAnecdotes(anecdotes)
        }
        effect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <h2>Anecdotes</h2>
            <Notification />
            <Filter />
            <AnecdoteForm />
            <AnecdoteList />
        </div>
    )
}

export default connect(null, { initializeAnecdotes })(App)
