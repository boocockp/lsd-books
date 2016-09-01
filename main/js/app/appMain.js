const React = require('react')
const ReactDOM = require('react-dom')
const {LocalStorageUpdateStore, S3UpdateStore, StateController, PersistentStore, CognitoCredentialsSource, JsonUtil} = require('lsd-storage')
const {GoogleSignin} = require('lsd-views')
const Books = require('../model/Books')
const App = require('../view/App')

const config = {
    "clientId": "919408445147-a0csgn7e21d773ilrif3q8d9hfrfc7vm.apps.googleusercontent.com",
    "identityPoolId": "eu-west-1:c0bf0e07-8c6a-4c40-b02a-13ccf6877bd1",
    "bucketName": "lsdbooks-main-data"
}

const dataSetParam = location.search.match(/dataSet=(\w+)/)
const dataSetOverride = dataSetParam && dataSetParam[1]
const appConfig = {
    appName: "lsdbooks",
    dataSet: dataSetOverride || "main"
}

const appStore = new StateController(new Books())

const localStore = new LocalStorageUpdateStore(appConfig.appName, appConfig.dataSet)
const googleSigninTracker = new GoogleSignin.Tracker()
const cognitoCredentialsSource = new CognitoCredentialsSource(config.identityPoolId)
googleSigninTracker.signIn.sendTo(cognitoCredentialsSource.signIn)
const remoteStore = new S3UpdateStore(config.bucketName,
                            S3UpdateStore.defaultUserAreaPrefix, S3UpdateStore.defaultSharedAreaPrefix,
                            appConfig.appName, appConfig.dataSet, cognitoCredentialsSource)

const persistentStore = new PersistentStore(localStore, remoteStore)

persistentStore.externalUpdate.sendTo(appStore.applyUpdate)
appStore.newUpdate.sendTo( persistentStore.dispatchUpdate )

persistentStore.init()

window.appStore_ = appStore
window.perStore = persistentStore

const container = document.getElementById('main')
const mainElement = React.createElement(App, {appStore: appStore, googleClientId: config.clientId})
const renderedElement = ReactDOM.render(mainElement, container)

