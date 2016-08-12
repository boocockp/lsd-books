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

    sendTo(...listeners) {
        for( const l of listeners) {
            if (typeof l !== 'function') {
                throw new Error(`Observable listener must be a function, not ${l}`)
            }
        }
        for( const l of listeners) {
            this._listeners.push(l)
            if (this._value !== undefined) {
                l(this._value)
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