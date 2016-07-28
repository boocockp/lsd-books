const EventList = require('./EventList')

module.exports = class InputEventObserver {
    constructor(eventFn) {
        this._listeners = []
        this.valueFn = eventFn
        this.valueFn._observer = this
        this.valueFn.forwardTo = this.forwardTo.bind(this)
    }

    check() {
        if (this.valueFn.triggered) {
            this.notify(this.valueFn.value)
        }
    }

    notify(data) {
        if (data instanceof EventList) {
            data.events.forEach( e => this.notify(e))
        } else {
            this._listeners.map(l => l(data) )
        }
    }

    forwardTo(...listeners) {
        for( const l of listeners) {
            if (typeof l !== 'function') {
                throw new Error(`Observable listener must be a function, not ${l}`)
            }
        }
        for( const l of listeners) {
            this._listeners.push(l)
        }
    }
}