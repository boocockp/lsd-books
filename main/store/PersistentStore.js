const uuid = require('node-uuid')

const ObservableData = require('../util/ObservableData')
const GoogleSigninTracker = require('../auth/GoogleSigninTracker')
const LocalStorageUpdateStore = require('../store/LocalStorageUpdateStore')
const S3UpdateStore = require('../store/S3UpdateStore')
const UpdateRouter = require('../store/UpdateRouter')
const NewActionRouter = require('../store/NewActionRouter')
const NewActionScheduler = require('../store/NewActionScheduler')
const StartupRouter = require('../store/StartupRouter')

function newId() {
    return uuid.v4()
}

module.exports = class PersistentStore {

    constructor(config) {
        this.externalAction = new ObservableData()
        this.dispatchedAction = new ObservableData()
        this.dispatchAction = this.dispatchAction.bind(this)

        this._assembleComponents(config)
    }

    init() {
        this.startupRouter.init()
    }

    dispatchAction(action) {
        const storedAction = Object.assign({id: newId()}, action)
        this.dispatchedAction.value = storedAction;
    }



    _assembleComponents(config) {
        this.localStore = new LocalStorageUpdateStore('reactbooks', localStorage)
        this.signinTracker = new GoogleSigninTracker()
        this.remoteStore = new S3UpdateStore('ashridgetech.reactbooks-test', 'updates', 'reactbooks', this.signinTracker, config.identityPoolId)
        this.updateRouter = new UpdateRouter()
        this.newActionRouter = new NewActionRouter()
        this.newActionScheduler = new NewActionScheduler()
        this.startupRouter = new StartupRouter()

        this.updateRouter.action.sendTo(this.externalAction.set)

        this.dispatchedAction.sendTo(this.localStore.storeAction, this.newActionScheduler.newAction)

        this.localStore.allActions.sendTo(this.newActionRouter.newActions)

        this.localStore.allActions.sendTo(this.startupRouter.actions)
        this.localStore.allUpdates.sendTo(this.startupRouter.updates)
        this.startupRouter.update.sendTo(this.updateRouter.update)

        this.newActionRouter.updateToStore.sendTo(this.remoteStore.storeUpdate)
        this.remoteStore.updateStored.sendTo(this.newActionRouter.updateStored,
                                                this.newActionScheduler.updateStored,
                                                this.localStore.storeUpdate)
        this.remoteStore.storeAvailable.sendTo(this.newActionScheduler.storeAvailable)
        this.newActionScheduler.storeRequired.sendTo(this.newActionRouter.tryToStore)
        this.newActionRouter.actionsToDelete.sendTo(this.localStore.deleteActions)

    }
}