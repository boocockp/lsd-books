module.exports = class Listeners {
    constructor() {
        this._listeners = []
    }

    add(listener) {
        this._listeners.push(listener)
    }

    notify(data) {
        this._listeners.map(l => l(data) )
    }
}