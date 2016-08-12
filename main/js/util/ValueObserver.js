const EventList = require('./EventList')

module.exports = class ValueObserver {
    constructor(eventFn) {
        this._listeners = []
        this._listeners = []
        this.valueFn = eventFn
        this.valueFn._observer = this
        this.valueFn.sendTo = this.sendTo.bind(this)
        this.valueFn.sendFlatTo = this.sendFlatTo.bind(this)
    }

    checkChange() {
        let currentValue = this.valueFn()
        if (currentValue !== undefined && currentValue !== this.previousValue) {
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

        let currentValue = this.valueFn()

        for( const l of listeners) {
            this._listeners.push(l)
            if (currentValue !== undefined) {
                l(currentValue)
            }
        }
    }

    sendFlatTo(...listeners) {
        this.sendTo(...listeners.map(this.flatListener))

    }

    flatListener(listener) {
        return function(collection) {
            collection.forEach( x => {
                listener(x)
                return true
            } )
        }
    }
}