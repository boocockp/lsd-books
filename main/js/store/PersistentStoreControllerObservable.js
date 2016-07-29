class PersistentStoreControllerObservable {

    constructor(state) {
        this.state = state
    }

    actionFromApp(action) {
        this.state = this.state.actionFromApp(action)
    }

    localStoredActions(actions) {
        this.state = this.state.localStoredActions(actions)
    }

    localStoredUpdates(updates) {
        this.state = this.state.localStoredUpdates(updates)
    }

    updateStoredRemote(update) {
        this.state = this.state.updateStoredRemote(update)
    }

    remoteStoreAvailable(isAvailable) {
        this.state = this.state.remoteStoreAvailable(isAvailable)
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

// makeInputValue(PersistentStoreController.prototype, "init")
// makeInputValueList(PersistentStoreController.prototype, "actionFromApp")
// makeInputValue(PersistentStoreController.prototype, "localStoredActions")
// makeInputValue(PersistentStoreController.prototype, "localStoredUpdates")
// makeInputValue(PersistentStoreController.prototype, "updateStoredRemote")
//
// makeInputValue(PersistentStoreController.prototype, "remoteStoreAvailable")
//
// makeOutputEvent(PersistentStoreController.prototype, "actionToStore")
// makeOutputEvent(PersistentStoreController.prototype, "updateToStoreRemote")
// makeOutputEvent(PersistentStoreController.prototype, "updateToStoreLocal")
// makeOutputEvent(PersistentStoreController.prototype, "actionsToDelete")
// makeOutputValue(PersistentStoreController.prototype, "actionToApply")

module.exports = PersistentStoreController

