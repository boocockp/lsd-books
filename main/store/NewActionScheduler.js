const ObservableData = require('../util/ObservableData')

module.exports = class NewActionScheduler {

    constructor() {
        this.storeRequired = new ObservableData() //TODO this is an event, not a value

        this.newAction = this.newAction.bind(this)
        this.updateStored = this.updateStored.bind(this)
    }

    newAction(action) {
        //TODO do not trigger when store in progress, when store not available
        // TODO trigger only after quiet for an interval
        this.storeRequired.set(true)
    }

    updateStored(update) {

    }

}