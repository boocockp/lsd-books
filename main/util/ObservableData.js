module.exports = class ObservableData {
    constructor(initialValue) {
        this._listeners = []
        this._value = initialValue
        this.set = this.set.bind(this)
    }

    get value() { return this._value }
    set value(data) {
        this.set(data)
    }

    set(data) {
        this._value = data
        this._listeners.map(l => l(data) )
    }

    sendTo(listener) {
        if (typeof listener !== 'function') {
            throw new Error(`Observable listener must be a function, not ${listener}`)
        }
        this._listeners.push(listener)
        if (this._value !== undefined) {
            listener(this._value)
        }
    }
}