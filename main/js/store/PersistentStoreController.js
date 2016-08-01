const uuid = require('node-uuid')
const {Record, List, Map} = require('immutable')

function subtractById(original, itemsToRemove) {
    return original.filterNot( x => itemsToRemove.find( y => y.id === x.id) )
}

class PersistentStoreController extends Record({_actionsFromApp: new List(),
                                                _localStoredActions: new List(),
                                                _localStoredUpdates: new List(),
                                                _updateStoredRemote: null,
                                                _remoteStoreAvailable: false,
                                                _started: false}) {

    static newId() {
        const ensureUnique = Math.floor(Math.random() * 1000000)
        return Date.now() + '-' + ensureUnique
    }

    static newUpdate(actions) {
        return {
            id: PersistentStoreController.newId(),
            actions: actions
        }
    }

    constructor() {
        super()
        this.prev(null)
    }

    prev(previousState) {
        this._previousState = {
            actionsToApply: previousState ? previousState.actionsToApply() : List(),
            updateToStoreLocal: previousState ? previousState.updateToStoreLocal() : null
        }

        return this
    }

    init() {
        return this.set('_started', true).prev(this)
    }

    actionFromApp(action) {
        const actionWithId = Object.assign({id: PersistentStoreController.newId()}, action)
        return this.update('_actionsFromApp', l => l.push(actionWithId)).prev(this);
    }

    localStoredActions(actions) {
        return this.set('_localStoredActions', List(actions)).prev(this)
    }

    localStoredUpdates(updates) {
        return this.set('_localStoredUpdates', List(updates)).prev(this)
    }

    updateStoredRemote(update) {
       return this.set('_updateStoredRemote', update).prev(this)
    }

    remoteStoreAvailable(isAvailable) {
        return this.set('_remoteStoreAvailable', isAvailable).prev(this)
    }

    actionToStore() {
        return this._actionsFromApp.filterNot( x => this._localStoredActions.find( y => y.id === x.id)).first()
    }

    updateToStoreRemote() {
        const actions = this._localStoredActions
        if (actions.size && this._remoteStoreAvailable) {
            return PersistentStoreController.newUpdate(actions)
        }
    }

    updateToStoreLocal() {
        if (this._updateStoredRemote != this._previousState.updateToStoreLocal) {
            return this._updateStoredRemote
        }
    }

    actionsToDelete() {
        if (this.updateToStoreLocal()) return this._updateStoredRemote.actions
    }

    actionsToApply() {
        if (this._started) {
            const actionsFromUpdates = this._localStoredUpdates.reduce( (acc, val) => acc.concat(val.actions), [])
            let allActions = List(actionsFromUpdates).concat(this._localStoredActions)
            allActions = subtractById(allActions, this._actionsFromApp)
            allActions = subtractById(allActions, this._previousState.actionsToApply)
            return allActions
        }

        return List()
    }

 }

module.exports = PersistentStoreController

