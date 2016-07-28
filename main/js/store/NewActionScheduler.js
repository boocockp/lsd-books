const {makeInputEvent, makeInputValue, makeOutputEvent, bindEventFunctions} = require('../util/Events')

class NewActionScheduler {

    constructor() {
        bindEventFunctions(this)
    }

    newAction() {
    }

    updateStored(update) {
    }

    storeAvailable(isAvailable) {
    }

    storeRequired() {
        // TODO do not trigger when store in progress
        // TODO trigger only after quiet for an interval
        const result = this.storeAvailable.value && (this.newAction.triggered || this.storeAvailable.changed);
        console.log('storeRequired', result)
        return result
    }

}

makeInputEvent(NewActionScheduler.prototype, "newAction")
makeInputEvent(NewActionScheduler.prototype, "updateStored")

makeInputValue(NewActionScheduler.prototype, "storeAvailable")

makeOutputEvent(NewActionScheduler.prototype, "storeRequired")

module.exports = NewActionScheduler