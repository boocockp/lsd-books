const {makeInputEvent, makeInputValue, makeOutputValue, makeOutputEvent, bindEventFunctions} = require('../util/Events')

class NewActionRouter {

    static newId() {
        const ensureUnique = Math.floor(Math.random() * 1000000)
        return Date.now() + '-' + ensureUnique
    }

    static newUpdate(actions) {
        return {
            id: NewActionRouter.newId(),
            actions: actions
        }
    }

    constructor() {
        bindEventFunctions(this)
    }

    newActions(actions) {
    }

    tryToStore(arg) {
    }

    updateStored(update) {
    }

    updateToStore() {
        const actions = this.newActions.value
        if (actions && actions.length && this.tryToStore.value) {
            return NewActionRouter.newUpdate(actions)
        }
    }

    actionsToDelete() {
        if (this.updateStored.value) return this.updateStored.value.actions
    }

}

makeInputValue(NewActionRouter.prototype, "newActions")
makeInputValue(NewActionRouter.prototype, "tryToStore")
makeInputValue(NewActionRouter.prototype, "updateStored")

makeOutputValue(NewActionRouter.prototype, "updateToStore")
makeOutputValue(NewActionRouter.prototype, "actionsToDelete")

module.exports = NewActionRouter