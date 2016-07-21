const ObservableData = require('../util/ObservableData')

module.exports = class NewActionRouter {

    static newId() {
        const ensureUnique = Math.floor(Math.random() * 1000000)
        return Date.now() + '-' + ensureUnique
    }

    constructor() {
        this.actionIdsSent = new Set()
        this.newUpdates = new ObservableData([])
        this.newActions = this.newActions.bind(this)
    }

    newActions(actions) {
        const actionsToSend = actions.filter( x => !this.actionIdsSent.has(x.id) )

        const newUpdate = {
            id: NewActionRouter.newId(),
            actions: actionsToSend
        };
        this.newUpdates.value = this.newUpdates.value.concat(newUpdate)
        actionsToSend.forEach( x => this.actionIdsSent.add(x.id) )
    }
}