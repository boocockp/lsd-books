const ObservableData = require('../util/ObservableData')

module.exports = class LocalStorageUpdateStore {

    constructor(appId, storage) {
        this.actionStoreKey = `${appId}.actions`
        this.storage = storage
        this.storedActions = new ObservableData(this._getLocalActions())
        this.allStoredUpdates = new ObservableData([])

        this.storeAction = this.storeAction.bind(this)
    }

    storeAction(action) {
        const updatedActions = this._getLocalActions().concat(action)
        this.storage.setItem(this.actionStoreKey, JSON.stringify(updatedActions))
        this.storedActions.value = updatedActions
    }

    _getLocalActions() {
        const actionsJson = this.storage.getItem(this.actionStoreKey) || '[]'
        return JSON.parse(actionsJson)
    }
}