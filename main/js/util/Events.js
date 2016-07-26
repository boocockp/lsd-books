const EventObserver = require('./EventObserver')

function bindEventFunctions(obj) {
    inputEvents(obj).concat(outputEvents(obj)).forEach( p => obj[p] = obj[p].bind(obj) )
    outputEvents(obj).forEach( p => new EventObserver(obj[p]) )
}

function inputEvents(obj) {
    return Object.getPrototypeOf(obj)._inputEvents
}

function outputEvents(obj) {
    return Object.getPrototypeOf(obj)._outputEvents
}

function resetInputEvents(obj) {
    inputEvents(obj).forEach( f => {
        obj[f].triggered = false
        obj[f].value = undefined
    })
}

function fireOutputEvents(obj) {
    outputEvents(obj).forEach( f => {
        obj[f]._observer.checkEvent()
    })
}

function makeInputEvent(obj, propertyName) {
    const originalFunction = obj[propertyName]
    obj[propertyName] = function (data) {
        resetInputEvents(this)
        this[propertyName].triggered = true
        this[propertyName].value = data
        originalFunction.call(this, data)
        fireOutputEvents(this)
    }

    obj._inputEvents = (obj._inputEvents || []).concat(propertyName)
}

function makeOutputEvent(obj, propertyName) {
    obj._outputEvents = (obj._outputEvents || []).concat(propertyName)
}

module.exports = {makeInputEvent, makeOutputEvent, bindEventFunctions}