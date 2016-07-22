const ObservableData = require('../util/ObservableData')

module.exports = class NewActionRouter {

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
        this.updateToStore = new ObservableData()
        this.actionsToDelete = new ObservableData()

        this.newActions = this.newActions.bind(this)
        this.tryToStore = this.tryToStore.bind(this)
        this.updateStored = this.updateStored.bind(this)
    }

    newActions(actions) {
        this._newActions = actions.slice()
    }

    tryToStore() {
        if (this._newActions && this._newActions.length) {
            this.updateToStore.value = NewActionRouter.newUpdate(this._newActions)
        }

    }

    updateStored(update) {
        this.actionsToDelete.set(update.actions)
    }
}