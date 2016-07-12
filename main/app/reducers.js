const {addAccount, updateAccount, addTransaction} = require('./actions');
const Books = require('../model/Books');


function booksReducer(state = new Books(), action) {

    switch(action.type) {
        case addAccount:
            return state.addAccount(action.data);

        case updateAccount:
            return state.updateAccount(action.id, action.data);

        case addTransaction:
            return state.addTransaction(action.transaction);


    }

}

module.exports = {booksReducer};