const ObservableData = require('../util/ObservableData')
const NewActionRouter = require('./NewActionRouter')

module.exports = class StartupRouter {

    constructor() {
        this._updates = []
        this._actions = []
        this.update = new ObservableData()

        this.updates = this.updates.bind(this)
        this.actions = this.actions.bind(this)
        this.init = this.init.bind(this)
    }

    updates(updates) {
        if (updates) {
            this._updates = this._updates.concat(updates)
        }
    }

    actions(actions) {
        if (actions) {
            this._actions = this._actions.concat(actions)
        }
    }

    // TODO why do we need this? - should kick in when wiring complete
    init() {
        this._updates.forEach( u => this.update.set(u))
        if (this._actions && this._actions.length) {
            this.update.set(NewActionRouter.newUpdate(this._actions))
        }
    }
}