const React = require('react')
const ReactDOM = require('react-dom')
const {LocalStorageUpdateStore, S3UpdateStore, StateController, PersistentStore, CognitoCredentialsSource, JsonUtil, UpdateScheduler} = require('lsd-storage')
const {GoogleSignin, ActivityTracker} = require('lsd-views')
const Books = require('../model/Books')
const App = require('../view/App')

function startApp(instanceConfig) {
    const appName = "lsdbooks"
    const dataSetParam = location.search.match(/dataSet=(\w+)/)
    const dataSetOverride = dataSetParam && dataSetParam[1]
    const dataSet = dataSetOverride || "main"

    const dataBucketName = `${appName}-${instanceConfig.instanceName}-data` //TODO share with defineEnv and promoter

    const appStore = new StateController(new Books())

    const localStore = new LocalStorageUpdateStore(appName, dataSet)
    const googleSigninTracker = new GoogleSignin.Tracker()
    const cognitoCredentialsSource = new CognitoCredentialsSource(instanceConfig.identityPoolId)
    googleSigninTracker.signIn.sendTo(cognitoCredentialsSource.signIn)
    const remoteStore = new S3UpdateStore(dataBucketName,
        S3UpdateStore.defaultUserAreaPrefix, S3UpdateStore.defaultSharedAreaPrefix,
        appName, dataSet, cognitoCredentialsSource)

    const persistentStore = new PersistentStore(localStore, remoteStore)

    persistentStore.externalUpdate.sendTo(appStore.applyUpdate)
    appStore.newUpdate.sendTo( persistentStore.dispatchUpdate )

    persistentStore.init()

    window.appStore_ = appStore
    window.perStore = persistentStore

    const container = document.getElementById('main')
    const mainElement = React.createElement(App, {appStore: appStore, googleClientId: instanceConfig.clientId})
    const renderedElement = ReactDOM.render(mainElement, container)

    const updater = new UpdateScheduler(5, 20)
    updater.updateRequired.sendTo(persistentStore.checkForUpdates)

    const activityTracker = new ActivityTracker()
    activityTracker.uiEvent.sendTo(updater.uiEventReceived)
    activityTracker.windowEvent.sendTo(updater.windowInUse)
}


fetch("config.json")
    .then( response => response.json() )
    .then( startApp )

