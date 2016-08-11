import _ from "lodash"

class PropertyDescriptor {
    constructor(data) {
        Object.assign(this, PropertyDescriptor.defaults(), data)
    }

    get label() {
        return _.startCase(this.name)
    }

    validate(entity) {
        const value = entity[this.name]
        return this.validators.map( v => v.validate(entity, value))
    }

}

PropertyDescriptor.defaults = function () {
    return {
        display: true,
        validators: []
    }
}

module.exports = PropertyDescriptor
