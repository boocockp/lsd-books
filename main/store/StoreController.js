const uuid = require('node-uuid')

function newId() {
    return uuid.v4()
}

class StoreController {

    constructor(appStore, localStore, remoteStore) {
        Object.assign(this, {appStore, localStore, remoteStore})
        this.actionsApplied = new Map()
        this.newAction = this.newAction.bind(this)
    }

    init() {
        this.remoteStore.getUpdates().then( updates => {
            const remoteActions = updates.map( x => x.actions ).reduce( (acc, val) => acc.concat(val), [] )
            this._applyActions(remoteActions)
            const localActions = this.localStore.getLocalActions()
            this._applyActions(localActions)
        })
    }

    newAction(action) {
        action.id = newId()
        this.localStore.storeAction(action)

        try {
            this.remoteStore.storeActions([action])
        } catch(e) {
            console.error(e)
        }
    }

    _applyActions(actions) {
        actions.filter( a => !this.actionsApplied.has(a.id))
                .forEach( a => this._applyAction(a) )
    }

    _applyAction(action) {
        this.actionsApplied.set(action.id, action)
        return this.appStore.applyAction(action)
    }
}

module.exports = StoreController
