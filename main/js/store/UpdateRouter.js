const {makeInputEvent, makeOutputEvent, bindEventFunctions} = require('../util/Events')

class UpdateRouter {

    constructor() {
        this.actionsApplied = new Set()
        this.updateIdsApplied = new Set()
        bindEventFunctions(this)
        this.update = this.update.bind(this)
    }

    updatesAvailable(newUpdateIds) {
    }

    update(update) {
        update.actions.filter( a => !this.actionsApplied.has(a.id))
            .forEach( this._actionToApply )

        this.updateIdsApplied.add(update.id)
    }

    _actionToApply(action) {
        this.actionsApplied.add(action.id)
    }

    action() {
        return this._actionToApply.triggered && this._actionToApply.value
    }

    updateIdsWanted() {
        return this.updatesAvailable.triggered && this.updatesAvailable.value.filter( x => !this.updateIdsApplied.has(x))
    }
}

module.exports = UpdateRouter

makeInputEvent(UpdateRouter.prototype, "updatesAvailable")
makeInputEvent(UpdateRouter.prototype, "_actionToApply")

makeOutputEvent(UpdateRouter.prototype, "action")
makeOutputEvent(UpdateRouter.prototype, "updateIdsWanted")
