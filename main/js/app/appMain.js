const React = require('react');
const ReactDOM = require('react-dom');
const {createStore} = require('redux');
const {addAccount, UpdateAccount, AddTransaction} = require('./actions');
const {JsonUtil} = require('lsd-storage')
const Books = require('../model/Books');
const {booksReducer} = require('./reducers');
const LocalStorageUpdateStore = require('lsd-storage').LocalStorageUpdateStore
const S3UpdateStore = require('lsd-storage').S3UpdateStore
const SynchronizingStore = require('lsd-storage').SynchronizingStore
const PersistentStore = require('lsd-storage').PersistentStore
const App = require('../view/App')
const GoogleSignin = require('superviews').GoogleSignin
const CognitoCredentialsSource = require('lsd-storage').CognitoCredentialsSource

const config = {
    "clientId": "919408445147-a0csgn7e21d773ilrif3q8d9hfrfc7vm.apps.googleusercontent.com",
    "identityPoolId": "eu-west-1:c46e1da2-72cf-4965-92b8-ebe270684050",
    "bucketName": "ashridgetech.reactbooks-test"
}

const dataSetParam = location.search.match(/dataSet=(\w+)/);
const dataSetOverride = dataSetParam && dataSetParam[1]
const appConfig = {
    appName: "reactbooks",
    dataSet: dataSetOverride || "main"
}

const reduxStore = createStore(booksReducer, new Books());
const appStore = new SynchronizingStore(reduxStore)

const localStore = new LocalStorageUpdateStore(appConfig.appName, appConfig.dataSet)
const googleSigninTracker = new GoogleSignin.Tracker()
const cognitoCredentialsSource = new CognitoCredentialsSource(config.identityPoolId)
googleSigninTracker.signIn.sendTo(cognitoCredentialsSource.signIn)
const remoteStore = new S3UpdateStore(config.bucketName, 'updates', appConfig.appName, appConfig.dataSet, cognitoCredentialsSource)

const persistentStore = new PersistentStore(localStore, remoteStore)

persistentStore.externalAction.sendTo(appStore.applyAction)
appStore.dispatches.sendTo( persistentStore.dispatchAction )

persistentStore.init()

function applyAction(jsonAction) {
    const action = JsonUtil.fromStore(JsonUtil.toStore(jsonAction))
    appStore.applyAction(action)
}


window.appStore_ = appStore
window.perStore = persistentStore
window.applyAction = applyAction

const container = document.getElementById('main')
const mainElement = React.createElement(App, {appStore: appStore})
const renderedElement = ReactDOM.render(mainElement, container)

