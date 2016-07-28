const {makeInputEvent, makeInputValue, makeOutputValue, bindEventFunctions} = require('../util/Events')
const EventList = require('../util/EventList')
const NewActionRouter = require('./NewActionRouter')

class StartupRouter {

    constructor() {
        this._updates = []
        this._actions = []
        bindEventFunctions(this)
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

    init() {
        return true
    }

    outgoingUpdates() {
        if (this.init.value) {
            const actionsUpdate = (this._actions && this._actions.length) ? NewActionRouter.newUpdate(this._actions) : []
            return this._updates.concat(actionsUpdate)
        }
    }

}

makeInputEvent(StartupRouter.prototype, "updates")
makeInputEvent(StartupRouter.prototype, "actions")
makeInputValue(StartupRouter.prototype, "init")

makeOutputValue(StartupRouter.prototype, "outgoingUpdates")

module.exports = StartupRouter