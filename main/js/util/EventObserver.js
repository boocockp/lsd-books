module.exports = class EventObserver {
    constructor(eventFn) {
        this._listeners = []
        this.eventFn = eventFn
        this.eventFn._observer = this
        this.eventFn.sendTo = this.sendTo.bind(this)
    }

    checkEvent() {
        let currentValue = this.eventFn()
        if (currentValue && currentValue !== this.previousValue) {
            this.notify(currentValue)
        }
        this.previousValue = currentValue
    }

    notify(data) {
        this._listeners.map(l => l(data) )
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