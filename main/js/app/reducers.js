const {addAccount, updateAccount, addTransaction} = require('./actions');
const Books = require('../model/Books');


function booksReducer(state, action) {

    switch(action.type) {
        case addAccount.name:
            return state.addAccount(action.data);

        case updateAccount.name:
            return state.updateAccount(action.data);

        case addTransaction.name:
            return state.addTransaction(action.transaction);

        default:
            return state
    }

}

module.exports = {booksReducer};