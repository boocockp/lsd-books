const uuid = require('node-uuid')

const ObservableData = require('../util/ObservableData')
const GoogleSigninTracker = require('../auth/GoogleSigninTracker')
const LocalStorageUpdateStore = require('../store/LocalStorageUpdateStore')
const S3UpdateStore = require('../store/S3UpdateStore')
const UpdateRouter = require('../store/UpdateRouter')
const NewActionRouter = require('../store/NewActionRouter')
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
        const storedAction = Object.assign({id: newId(), action})
        this.dispatchedAction.value = storedAction;
    }



    _assembleComponents(config) {
        this.localStore = new LocalStorageUpdateStore('reactbooks', localStorage)
        this.signinTracker = new GoogleSigninTracker()
        this.remoteStore = new S3UpdateStore('ashridgetech.reactbooks-test', 'updates', 'reactbooks', this.signinTracker, config.identityPoolId)
        this.updateRouter = new UpdateRouter()
        this.newActionRouter = new NewActionRouter()
        this.startupRouter = new StartupRouter()

        this.updateRouter.action.sendTo(this.externalAction.set)

        this.dispatchedAction.sendTo(this.localStore.storeAction)

        this.localStore.storedActions.sendTo(this.newActionRouter.newActions)

        // this.newActionRouter.newUpdates.sendTo(this.remoteStore.storeUpdate)
        this.newActionRouter.newUpdates.sendTo(this.startupRouter.updatesFromStore)
        this.localStore.allStoredUpdates.sendTo(this.startupRouter.updatesFromStore)
        this.startupRouter.updates.sendTo(this.updateRouter.updates)
    }
}