import anecdoteService from '../services/anecdotes'


const reducer = (state = [], action) => {
    switch(action.type) {
        case 'CREATE':
            return state.concat(action.data)
        case 'VOTE': {
            return state.map(anecdote => 
                anecdote.id !== action.data.id ? anecdote : action.data
            )
        }
        case 'INIT_ANECDOTES':
            return action.data
        default:
            return state
    }
}

export default reducer

export const incrementVotes = (anecdote) => {
    return async (dispatch) => {
        const newAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
        const data = await anecdoteService.update(anecdote.id, newAnecdote)
        dispatch({ type: 'VOTE', data })
    }
}

export const createAnecdote = (content) => {
    return async (dispatch) => {
        const data = await anecdoteService.create(content)
        dispatch({ type: 'CREATE', data })
    }
}

export const initializeAnecdotes = () => {
    return async (dispatch) => {
        const data = await anecdoteService.getAll()
        dispatch({ type: 'INIT_ANECDOTES', data })
    }
}
