const uuid = require('node-uuid')

function newId() {
    return uuid.v4()
}

class SynchronizingStore {

    constructor(reduxStore, localStore) {
        Object.assign(this, {reduxStore, localStore})
        this.actionsApplied = new Map()
        this.dispatch = this.dispatch.bind(this)
    }

    getState() {
        return this.reduxStore.getState()
    }

    dispatch(action) {
        const id = action.id = newId()
        this.localStore.storeAction(action)
        this.applyAction(action);
    }

    subscribe(listener) {
        return this.reduxStore.subscribe(listener)
    }

    init() {
        const localActions = this.localStore.getLocalActions()
        this.applyActions(localActions)
    }

    applyActions(actions) {
        actions.filter( a => !this.actionsApplied.has(a.id))
                .forEach( a => this.applyAction(a) )
    }

    applyAction(action) {
        this.actionsApplied.set(action.id, action)
        return this.reduxStore.dispatch(action)
    }
}

module.exports = SynchronizingStore
