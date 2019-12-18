
const reducer = (state = '', action) => {
    switch (action.type) {
        case 'FILTER':
            return (action.data !== undefined) ? action.data.toLowerCase() : state
        default:
            return state
    }
}

export default reducer

export const setFilter = (filter) => ({
    type: 'FILTER',
    data: filter
})
