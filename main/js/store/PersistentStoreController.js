const uuid = require('node-uuid')
const {Record, List, Map} = require('immutable')

const ObservableData = require('../util/ObservableData')
const UpdateRouter = require('./UpdateRouter')
const NewActionRouter = require('./NewActionRouter')
const NewActionScheduler = require('./NewActionScheduler')
const StartupRouter = require('./StartupRouter')

function newId() {
    return uuid.v4()
}

class PersistentStoreController extends Record({_actionsFromApp: new List(),
                                                _localStoredActions: new List(),
                                                _localStoredUpdates: new List(),
                                                _updateStoredRemote: null,
                                                _remoteStoreAvailable: false}) {

    constructor() {
        bindEventFunctions(this)
    }

    prev(previousState) {
        this._previousState = {
            actionsToApply: previousState.actionsToApply()
        }
    }

    actionFromApp(action) {
        const actionWithId = Object.assign({id: newId()}, action)
        return this.update('_actionsFromApp', l => l.push(actionWithId)).prev(this);
    }

    localStoredActions(actions) {
        return this.set('_localStoredActions', actions).prev(this)
    }

    localStoredUpdates(updates) {
        return this.set('_localStoredUpdates', updates).prev(this)
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
            return NewActionRouter.newUpdate(actions)
        }
    }

    updateToStoreLocal() {
        return this._updateStoredRemote
    }

    actionsToDelete() {
        if (this._updateStoredRemote) return this._updateStoredRemote.actions
    }

    actionsToApply() {
        return this._localStoredActions.toSet().subtract(this._actionsFromApp).subtract(this._previousState.actionsToApply)
    }

 }

module.exports = PersistentStoreController

