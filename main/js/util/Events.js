const EventObserver = require('./EventObserver')
const InputEventObserver = require('./InputEventObserver')
const ValueObserver = require('./ValueObserver')
const InputValueObserver = require('./InputValueObserver')

function bindEventFunctions(obj) {
    inputEvents(obj).concat(outputEvents(obj), inputValues(obj), outputValues(obj)).forEach( p => obj[p] = obj[p].bind(obj) )
    inputValues(obj).forEach( p => new InputValueObserver(obj[p]) )
    inputEvents(obj).forEach( p => new InputEventObserver(obj[p]) )
    outputValues(obj).forEach( p => new ValueObserver(obj[p]) )
    outputEvents(obj).forEach( p => new EventObserver(obj[p]) )
}

function inputValues(obj) {
    return Object.getPrototypeOf(obj)._inputValues || []
}

function inputEvents(obj) {
    return Object.getPrototypeOf(obj)._inputEvents || []
}

function outputValues(obj) {
    return Object.getPrototypeOf(obj)._outputValues || []
}

function outputEvents(obj) {
    return Object.getPrototypeOf(obj)._outputEvents || []
}

function resetInputEvents(obj) {
    inputValues(obj).forEach( f => {
        obj[f].changed = false
    })

    inputEvents(obj).forEach( f => {
        obj[f].triggered = false
        obj[f].value = undefined
    })
}

function notifyOutputChanges(obj) {
    inputValues(obj).forEach( f => {
        obj[f]._observer.check()
    })
    inputEvents(obj).forEach( f => {
        obj[f]._observer.check()
    })
    outputValues(obj).forEach( f => {
        obj[f]._observer.checkChange()
    })
    outputEvents(obj).forEach( f => {
        obj[f]._observer.checkEvent()
    })
}

function makeInputValue(obj, propertyName) {
    const propDesc = Object.getOwnPropertyDescriptor(obj, propertyName)
    if (propDesc.value && typeof propDesc.value === "function") {
        const originalFunction = propDesc.value
        propDesc.value = function (data) {
            resetInputEvents(this)
            this[propertyName].changed = this[propertyName].value !== data
            const originalFunctionResult = originalFunction.call(this, data)
            this[propertyName].value = (originalFunctionResult !== undefined) ? originalFunctionResult : data
            notifyOutputChanges(this)
        }
        Object.defineProperty(obj, propertyName, propDesc)
    } else {
        throw new Error(`Cannot make input value with ${propertyName} of ${obj}: property is not a function`)
    }

    obj._inputValues = (obj._inputValues || []).concat(propertyName)
}

function makeInputEvent(obj, propertyName) {
    const propDesc = Object.getOwnPropertyDescriptor(obj, propertyName)
    if (propDesc.value && typeof propDesc.value === "function") {
        const originalFunction = propDesc.value
        propDesc.value = function (data) {
            resetInputEvents(this)
            this[propertyName].triggered = true
            const originalFunctionResult = originalFunction.call(this, data)
            this[propertyName].value = (originalFunctionResult !== undefined) ? originalFunctionResult : data
            notifyOutputChanges(this)
        }
        Object.defineProperty(obj, propertyName, propDesc)
    } else {
        throw new Error(`Cannot make input event with ${propertyName} of ${obj}: property is not a function`)
    }

    obj._inputEvents = (obj._inputEvents || []).concat(propertyName)
}

function makeOutputEvent(obj, propertyName) {
    obj._outputEvents = (obj._outputEvents || []).concat(propertyName)
}

function makeOutputValue(obj, propertyName) {
    obj._outputValues = (obj._outputValues || []).concat(propertyName)
}

module.exports = {makeInputEvent, makeInputValue, makeOutputEvent, makeOutputValue, bindEventFunctions}