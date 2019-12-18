
const reducer = (state = [], action) => {
    switch(action.type) {
        case 'CREATE':
            return state
                .concat(action.data)
        case 'VOTE': {
            const anecdoteToChange = state.find(a => a.id === action.data.id)
            const changedAnecdote = { ...anecdoteToChange, votes: anecdoteToChange.votes + 1 }
            return state.map(anecdote => 
                anecdote.id !== action.data.id ? anecdote : changedAnecdote
            )
        }
        case 'INIT_ANECDOTES':
            return action.data
        default:
            return state
    }
}

export default reducer

export const incrementVotes = (id) => ({
    type: 'VOTE',
    data: { id }
})

export const createAnecdote = (data) => ({
    type: 'CREATE',
    data
})

export const initializeAnecdotes = (data) => ({
    type: 'INIT_ANECDOTES',
    data
})
