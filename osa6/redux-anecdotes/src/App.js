import React from 'react';
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'

const App = (props) => (
    <div>
        <h2>Anecdotes</h2>
        <Notification store={props.store} />
        <Filter store={props.store} />
        <AnecdoteForm store={props.store} />
        <AnecdoteList store={props.store} />
    </div>
)

export default App
