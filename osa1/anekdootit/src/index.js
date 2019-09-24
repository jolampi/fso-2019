import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({ text }) => <h1>{text}</h1>

const Button = ({ onClick, text }) => (
    <button onClick={onClick}>
        {text}
    </button>
)

const Anecdote = ({ anecdote, votes }) => (
    <div>
        {anecdote}
        <br />
        has {votes} votes
    </div>
)

const App = (props) => {
    const length = props.anecdotes.length

    const [selected, setSelected] = useState(0)
    const [votes, setVotes] = useState(new Array(length).fill(0))
    const [mostVoted, setMostVoted] = useState(0)

    const nextAnecdoteHandler = () => {
        setSelected(Math.floor(Math.random() * props.anecdotes.length))
    }

    const voteHandler = () => {
        const newVotes = votes[selected] + 1
        const votesCopy = [ ...votes ]
        votesCopy[selected] = newVotes
        setVotes(votesCopy)
        if (votesCopy[selected] > votesCopy[mostVoted]) { setMostVoted(selected) }
    }

    return (
        <div>
            <Header text="Anecdote of the day" />
            <Anecdote anecdote={props.anecdotes[selected]} votes={votes[selected]} />
            <Button onClick={voteHandler} text="vote" />
            <Button onClick={nextAnecdoteHandler} text="next anecdote" />
            <Header text="Anecdote with most votes" />
            <Anecdote anecdote={props.anecdotes[mostVoted]} votes={votes[mostVoted]} />
        </div>
    )
}

const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
    <App anecdotes={anecdotes} />,
    document.getElementById('root')
)