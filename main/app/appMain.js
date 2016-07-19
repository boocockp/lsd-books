const React = require('react');
const ReactDOM = require('react-dom');
const {createStore} = require('redux');
const {addAccount, UpdateAccount, AddTransaction} = require('./actions');
const Books = require('../model/Books');
const {booksReducer} = require('./reducers');
const LocalStorageUpdateStore = require('../store/LocalStorageUpdateStore')
const SynchronizingStore = require('../store/SynchronizingStore')
const AccountList = require('../viewbuild/AccountList')
const App = require('../viewbuild/App')
const AppProvider = require('../viewbuild/AppProvider')
const AccountType = require('../model/Types').AccountType

const reduxStore = createStore(booksReducer, new Books());
const localStore = new LocalStorageUpdateStore('reactbooks', localStorage)
const store = new SynchronizingStore(reduxStore, localStore)
window.store = store;

const mainElement = React.createElement(AppProvider, {store})
const renderedElement = ReactDOM.render(mainElement, document.getElementById('main'))

store.init()


// store.dispatch(addAccount({id: 1001, name: "Travel", code: "4110", type: AccountType.EXPENSE}))
// store.dispatch(addAccount({id: 1002, name: "Accommodation", code: "4120", type: AccountType.REVENUE}))
//
// window.setTimeout( () => store.dispatch(addAccount({id: 1003, name: "Food", code: "4130", type: AccountType.CAPITAL})), 2000)





