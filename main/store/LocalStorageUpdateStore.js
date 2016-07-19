module.exports = class LocalStorageUpdateStore {

    constructor(appId, storage) {
        this.actionStoreKey = `${appId}.actions`
        this.storage = storage
    }

    storeAction(action) {
        const updatedActions = this.getLocalActions().concat(action)
        this.storage.setItem(this.actionStoreKey, JSON.stringify(updatedActions))
    }

    getLocalActions() {
        const actionsJson = this.storage.getItem(this.actionStoreKey) || '[]'
        return JSON.parse(actionsJson)
    }
}