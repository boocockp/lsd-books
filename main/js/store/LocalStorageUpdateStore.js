const {makeInputEvent, makeOutputValue, bindEventFunctions} = require('../util/Events')
const JsonUtil = require('../../../shared/modules/json/JsonUtil')

class LocalStorageUpdateStore {

    constructor(appId, dataSet) {
        this.actionStoreKey = `${appId}.${dataSet}.actions`
        this.updateStoreKey = `${appId}.${dataSet}.updates`
        this.storage = window.localStorage
        bindEventFunctions(this)
    }

    storeAction(action) {
        const updatedActions = this.allActions().concat(action)
        this._storedActions = this._writeToStorage(this.actionStoreKey, updatedActions)
    }

    deleteActions(actions) {
        const deletedIds = new Set(actions.map( a => a.id))
        const updatedActions = this.allActions().filter( a => !deletedIds.has(a.id) )
        this._storedActions = this._writeToStorage(this.actionStoreKey, updatedActions)
    }

    storeUpdate(update) {
        const updatedUpdates = this.allUpdates().concat(update)
        this._storedUpdates = this._writeToStorage(this.updateStoreKey, updatedUpdates)
    }

    allActions() {
        return this._storedActions || this._getFromStorage(this.actionStoreKey)
    }

    allUpdates() {
        return this._storedUpdates || this._getFromStorage(this.updateStoreKey)
    }

    _getFromStorage(key) {
        const json = this.storage.getItem(key) || '[]'
        return JsonUtil.fromStore(json)
    }

    _writeToStorage(key, data) {
        this.storage.setItem(key, JsonUtil.toStore(data))
        return data
    }
}

makeInputEvent(LocalStorageUpdateStore.prototype, "storeAction")
makeInputEvent(LocalStorageUpdateStore.prototype, "deleteActions")
makeInputEvent(LocalStorageUpdateStore.prototype, "storeUpdate")

makeOutputValue(LocalStorageUpdateStore.prototype, "allActions")
makeOutputValue(LocalStorageUpdateStore.prototype, "allUpdates")

module.exports = LocalStorageUpdateStore