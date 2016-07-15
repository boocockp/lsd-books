const React = require('react');
const ReactDOM = require('react-dom');
const {createStore} = require('redux');
const {addAccount, UpdateAccount, AddTransaction} = require('./actions');
const Books = require('../model/Books');
const {booksReducer} = require('./reducers');
const AccountList = require('../viewbuild/AccountList')
const App = require('../viewbuild/App')
const AppProvider = require('../viewbuild/AppProvider')

const store = createStore(booksReducer, new Books());
window.store = store;
console.log("Initial state", store.getState())

const mainElement = React.createElement(AppProvider, {store})
const renderedElement = ReactDOM.render(mainElement, document.getElementById('main'))


store.dispatch(addAccount({id: 1001, name: "Travel", code: "4110"}))
store.dispatch(addAccount({id: 1002, name: "Accommodation", code: "4120"}))

window.setTimeout( () => store.dispatch(addAccount({id: 1003, name: "Food", code: "4130"})), 2000)





