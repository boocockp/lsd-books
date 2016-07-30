const {makeInputEvent, makeInputValue, makeOutputValue, makeOutputEvent, bindEventFunctions} = require('../util/Events')

class PersistentStoreControllerObservable {

    constructor(state) {
        this.state = state
        bindEventFunctions(this)
    }

    init() {
        this.state = this.state.init()
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
        return this.state.actionToStore()
    }

    updateToStoreRemote() {
        return this.state.updateToStoreRemote()
    }

    updateToStoreLocal() {
        return this.state.updateToStoreLocal()
    }

    actionsToDelete() {
        return this.state.actionsToDelete()
    }

    actionsToApply() {
        return this.state.actionsToApply()
    }

}

makeInputValue(PersistentStoreControllerObservable.prototype, "init")
makeInputValue(PersistentStoreControllerObservable.prototype, "actionFromApp")
makeInputValue(PersistentStoreControllerObservable.prototype, "localStoredActions")
makeInputValue(PersistentStoreControllerObservable.prototype, "localStoredUpdates")
makeInputValue(PersistentStoreControllerObservable.prototype, "updateStoredRemote")
makeInputValue(PersistentStoreControllerObservable.prototype, "remoteStoreAvailable")

makeOutputValue(PersistentStoreControllerObservable.prototype, "actionToStore")
makeOutputValue(PersistentStoreControllerObservable.prototype, "updateToStoreRemote")
makeOutputValue(PersistentStoreControllerObservable.prototype, "updateToStoreLocal")
makeOutputValue(PersistentStoreControllerObservable.prototype, "actionsToDelete")
makeOutputValue(PersistentStoreControllerObservable.prototype, "actionsToApply")

module.exports = PersistentStoreControllerObservable

