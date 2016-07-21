const ObservableData = require('../util/ObservableData')

module.exports = class LocalStorageUpdateStore {

    constructor(appId, storage) {
        this.actionStoreKey = `${appId}.actions`
        this.updateStoreKey = `${appId}.updates`
        this.storage = storage
        this.storedActions = new ObservableData(this._getActions())
        this.allStoredUpdates = new ObservableData(this._getUpdates())

        this.storeAction = this.storeAction.bind(this)
        this.storeUpdate = this.storeUpdate.bind(this)
        this.deleteActions = this.deleteActions.bind(this)
    }

    storeAction(action) {
        const updatedActions = this._getActions().concat(action)
        this.storage.setItem(this.actionStoreKey, JSON.stringify(updatedActions))
        this.storedActions.value = updatedActions
    }

    deleteActions(actions) {
        const deletedIds = new Set(actions.map( a => a.id))
        const updatedActions = this._getActions().filter( a => !deletedIds.has(a.id) )
        this.storage.setItem(this.actionStoreKey, JSON.stringify(updatedActions))
        this.storedActions.value = updatedActions
    }

    storeUpdate(update) {
        const updatedUpdates = this._getUpdates().concat(update)
        this.storage.setItem(this.updateStoreKey, JSON.stringify(updatedUpdates))
        this.allStoredUpdates.value = updatedUpdates
    }



    _getActions() {
        const actionsJson = this.storage.getItem(this.actionStoreKey) || '[]'
        return JSON.parse(actionsJson)
    }

    _getUpdates() {
        const updatesJson = this.storage.getItem(this.updateStoreKey) || '[]'
        return JSON.parse(updatesJson)
    }
}