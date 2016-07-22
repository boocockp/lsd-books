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

    // TODO why do we need this? - should kick in when wiring complete
    init() {
        this.updates.value = this._updates
    }
}