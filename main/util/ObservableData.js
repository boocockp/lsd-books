module.exports = class ObservableData {
    constructor() {
        this._listeners = []
        this._value = undefined
    }

    get value() { return this._value }
    set value(data) {
        this._value = data
        this._listeners.map(l => l(data) )
    }

    sendTo(listener) {
        this._listeners.push(listener)
    }
}