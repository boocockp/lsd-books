function booksReducer(state, action) {

    const methodName = action.type
    const updateFunction = state[methodName]
    if (typeof updateFunction !== 'function')  {
        if (methodName !== '@@redux/INIT') {
            console.warn( `Method ${methodName} not found on ${state}`)
        }
        return state
    }
    return updateFunction.call(state, action.data)
}

module.exports = {booksReducer};