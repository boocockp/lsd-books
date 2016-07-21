const ObservableData = require('../util/ObservableData')

module.exports = class StartupRouter {

    constructor() {
        this._updates = []
        this.updates = new ObservableData()

        this.updatesFromStore = this.updatesFromStore.bind(this)
    }

    updatesFromStore(updates) {
        if (updates) {
            this._updates = this._updates.concat(updates)
        }
    }

    init() {
        this.updates.value = this._updates
    }
}