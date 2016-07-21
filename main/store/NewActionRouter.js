const ObservableData = require('../util/ObservableData')

module.exports = class NewActionRouter {

    static newId() {
        const ensureUnique = Math.floor(Math.random() * 1000000)
        return Date.now() + '-' + ensureUnique
    }

    constructor() {
        this.actionIdsSent = new Set()
        this.updatesToRemote = new ObservableData()
        this.updateToLocal = new ObservableData()
        this.actionsToDelete = new ObservableData()
        this.newActions = this.newActions.bind(this)
        this.updateStored = this.updateStored.bind(this)
    }

    newActions(actions) {
        const actionsToSend = actions.filter( x => !this.actionIdsSent.has(x.id) )

        if (actionsToSend.length) {
            const newUpdate = {
                id: NewActionRouter.newId(),
                actions: actionsToSend
            };
            this.updatesToRemote.value = this.updatesToRemote.value.concat(newUpdate)
            this.updateToLocal.value = newUpdate
            actionsToSend.forEach( x => this.actionIdsSent.add(x.id) )
        }
    }

    updateStored(update) {
        this.updatesToRemote.value = this.updatesToRemote.value.filter(u => u.id != update.id )
        this.actionsToDelete.set(update.actions)
    }
}