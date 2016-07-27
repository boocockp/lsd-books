const EventList = require('./EventList')

module.exports = class EventObserver {
    constructor(eventFn) {
        this._listeners = []
        this.valueFn = eventFn
        this.valueFn._observer = this
        this.valueFn.sendTo = this.sendTo.bind(this)
    }

    checkEvent() {
        let currentValue = this.valueFn()
        if (currentValue && currentValue !== this.previousValue) {
            this.notify(currentValue)
        }
        this.previousValue = currentValue
    }

    notify(data) {
        if (data instanceof EventList) {
            data.events.forEach( e => this.notify(e))
        } else {
            this._listeners.map(l => l(data) )
        }
    }

    sendTo(...listeners) {
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