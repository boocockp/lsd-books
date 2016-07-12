const {createStore} = require('redux');
const {addAccount, UpdateAccount, AddTransaction} = require('./actions');
const Books = require('../model/Books');
const {booksReducer} = require('./reducers');

const store = createStore(booksReducer);

window.store = store;

console.log(store.getState());

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
let unsubscribe = store.subscribe(() =>
    console.log(store.getState())
)

// Dispatch some actions
store.dispatch(addAccount({id: 1001, name: "Travel"}))

// Stop listening to state updates
unsubscribe()

