
const reducer = (state = '', action) => {
    switch (action.type) {
        case 'FILTER':
            return action.data
        default:
            return state
    }
}

export default reducer

export const setFilter = (filter) => ({
    type: 'FILTER',
    data: filter.toLowerCase()
})
