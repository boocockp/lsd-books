const {makeInputEvent, makeOutputEvent, bindEventFunctions} = require('../util/Events')
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
    }

    update() {
        if (this.init.triggered) {
            const actionsUpdate = (this._actions && this._actions.length) ? NewActionRouter.newUpdate(this._actions) : []
            return new EventList( this._updates.concat(actionsUpdate))
        }
    }

}

makeInputEvent(StartupRouter.prototype, "updates")
makeInputEvent(StartupRouter.prototype, "actions")
makeInputEvent(StartupRouter.prototype, "init")

makeOutputEvent(StartupRouter.prototype, "update")

module.exports = StartupRouter