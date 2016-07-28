const EventList = require('../util/EventList')
const {makeInputEvent, makeInputValue, makeOutputValue, makeOutputEvent, bindEventFunctions} = require('../util/Events')

class UpdateRouter {

    constructor() {
        this.actionIdsApplied = new Set()
        this.updateIdsApplied = new Set()
        this.latestUpdates = []
        bindEventFunctions(this)
    }

    updatesAvailable(newUpdateIds) {
    }

    updates(updates) {
        const updatesArray = [].concat(updates)
        this.updateIdsApplied.add(this.latestUpdates.map( x => x.id ))
        let actionIds = (update) => update.actions.map( x => x.id )
        const latestActionIds = [].concat(...this.latestUpdates.map(actionIds))

        this.actionIdsApplied.add(latestActionIds)

        this.latestUpdates = updatesArray
    }

    actions() {
        let actions = (update) => update.actions
        const latestActions = [].concat(...this.latestUpdates.map(actions))
        const newActions = latestActions.filter( a => !this.actionIdsApplied.has(a.id))

        if (newActions.length) {
            return new EventList(newActions)
        }
    }

    updateIdsWanted() {
        return this.updatesAvailable.triggered && this.updatesAvailable.value.filter( x => !this.updateIdsApplied.has(x))
    }
}

module.exports = UpdateRouter

makeInputValue(UpdateRouter.prototype, "updatesAvailable")
makeInputValue(UpdateRouter.prototype, "updates")

makeOutputValue(UpdateRouter.prototype, "actions")
makeOutputValue(UpdateRouter.prototype, "updateIdsWanted")
