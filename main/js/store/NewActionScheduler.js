const {makeInputEvent, makeInputValue, makeOutputEvent, bindEventFunctions} = require('../util/Events')

class NewActionScheduler {

    constructor() {
        bindEventFunctions(this)
    }

    newAction(action) {
    }

    updateStored(update) {
    }

    storeAvailable(isAvailable) {
    }

    storeRequired() {
        // TODO do not trigger when store in progress
        // TODO trigger only after quiet for an interval
        return this.newAction.triggered || (this.storeAvailable.triggered && this.storeAvailable.value)
    }

}

makeInputEvent(NewActionScheduler.prototype, "newAction")
makeInputEvent(NewActionScheduler.prototype, "updateStored")
makeInputEvent(NewActionScheduler.prototype, "storeAvailable")

makeOutputEvent(NewActionScheduler.prototype, "storeRequired")

module.exports = NewActionScheduler