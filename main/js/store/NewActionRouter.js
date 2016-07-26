const ObservableData = require('../util/ObservableData')
const EventObserver = require('../util/EventObserver')

class NewActionRouter {

    static newId() {
        const ensureUnique = Math.floor(Math.random() * 1000000)
        return Date.now() + '-' + ensureUnique
    }

    static newUpdate(actions) {
        return {
            id: NewActionRouter.newId(),
            actions: actions
        }
    }

    constructor() {
        this._bindEventFunctions()
    }

    // get newActions() {
    //     return this._newActions
    // }

    /*set */
    // input event
    newActions(actions) {
        this._newActions = actions.slice()
    }

    // input event
    tryToStore() {
    }

    // input event
    updateStored(update) {
    }

    // output event
    updateToStore() {
        const actions = this._newActions
        if (actions && actions.length && this.tryToStore.triggered) {
            return NewActionRouter.newUpdate(actions)
        }
    }

    // output event
    actionsToDelete() {
        if (this.updateStored.triggered) return this.updateStored.value.actions
    }

    _inputEvents() {
        return ['newActions', 'tryToStore', 'updateStored']
    }

    _outputEvents() {
        return ['updateToStore', 'actionsToDelete']
    }

    _bindEventFunctions() {
        this._inputEvents().concat(this._outputEvents()).forEach( p => this[p] = this[p].bind(this) )
        this._outputEvents().forEach( p => new EventObserver(this[p]) )
    }

    _resetInputEvents() {
        this._inputEvents().forEach( f => {
            this[f].triggered = false
            this[f].value = undefined
        })
    }

    _fireOutputEvents() {
        this._outputEvents().forEach( f => {
            this[f]._observer.checkEvent()
        })
    }

}


function makeInputEventFunction(obj, propertyName) {
    const originalFunction = obj[propertyName]
    obj[propertyName] = function (data) {
        this._resetInputEvents()
        this[propertyName].triggered = true
        this[propertyName].value = data
        originalFunction.call(this, data)
        this._fireOutputEvents()
    }
}

makeInputEventFunction(NewActionRouter.prototype, "newActions")
makeInputEventFunction(NewActionRouter.prototype, "tryToStore")
makeInputEventFunction(NewActionRouter.prototype, "updateStored")

module.exports = NewActionRouter