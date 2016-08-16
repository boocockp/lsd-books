const React = require('react')
const ReactDOM = require('react-dom')
const Books = require('../model/Books')
const {LocalStorageUpdateStore, S3UpdateStore, SynchronizingStore, PersistentStore, CognitoCredentialsSource, JsonUtil} = require('lsd-storage')
const App = require('../view/App')
const GoogleSignin = require('superviews').GoogleSignin

const config = {
    "clientId": "919408445147-a0csgn7e21d773ilrif3q8d9hfrfc7vm.apps.googleusercontent.com",
    "identityPoolId": "eu-west-1:c46e1da2-72cf-4965-92b8-ebe270684050",
    "bucketName": "ashridgetech.reactbooks-test"
}

const dataSetParam = location.search.match(/dataSet=(\w+)/)
const dataSetOverride = dataSetParam && dataSetParam[1]
const appConfig = {
    appName: "reactbooks",
    dataSet: dataSetOverride || "main"
}

const appStore = new SynchronizingStore(new Books())

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
const mainElement = React.createElement(App, {appStore: appStore, googleClientId: config.clientId})
const renderedElement = ReactDOM.render(mainElement, container)

