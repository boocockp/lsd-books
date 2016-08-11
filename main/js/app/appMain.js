const React = require('react');
const ReactDOM = require('react-dom');
const {createStore} = require('redux');
const {addAccount, UpdateAccount, AddTransaction} = require('./actions');
const Books = require('../model/Books');
const {booksReducer} = require('./reducers');
const LocalStorageUpdateStore = require('../store/LocalStorageUpdateStore')
const S3UpdateStore = require('../store/S3UpdateStore')
const SynchronizingStore = require('../store/SynchronizingStore')
const PersistentStore = require('../store/PersistentStore')
const App = require('../view/App')
const AppProvider = require('../view/AppProvider')
const AccountType = require('../model/Types').AccountType
const GoogleSigninTracker = require('../auth/GoogleSigninTracker')

const config = {
    "clientId": "919408445147-a0csgn7e21d773ilrif3q8d9hfrfc7vm.apps.googleusercontent.com",
    "identityPoolId": "eu-west-1:c46e1da2-72cf-4965-92b8-ebe270684050",
    "bucketName": "ashridgetech.reactbooks-test"
}

const dataSetOverride = location.search.match(/dataSet=(\w+)/)[1]
const appConfig = {
    appName: "reactbooks",
    dataSet: dataSetOverride || "main"
}

const reduxStore = createStore(booksReducer, new Books());
const appStore = new SynchronizingStore(reduxStore)
const persistentStore = new PersistentStore({...config, ...appConfig})
persistentStore.externalAction.sendTo(appStore.applyAction)
appStore.dispatches.sendTo( persistentStore.dispatchAction )

persistentStore.init()


window.appStore_ = appStore;
window.perStore = persistentStore;

const container = document.getElementById('main')
if (container) {
    const mainElement = React.createElement(AppProvider, {store: appStore})
    const renderedElement = ReactDOM.render(mainElement, container)
}

