import List from 'immutable'
import _ from 'lodash'
import PropertyDescriptor from './PropertyDescriptor'

class EntityDescriptor {
    constructor(name, propertyDescriptorData) {
        const propertyDescriptors = propertyDescriptorData.map( p => new PropertyDescriptor(p) )
        Object.assign(this, {name, propertyDescriptors})
    }
    propertyDescriptor(name) {
        const desc = this.propertyDescriptors.find(x => x.name === name )
        if (!desc) {
            throw new Error(`No property ${name} in type ${this.name}`)
        }
        return desc
    }
    get propertyNames() { return this.propertyDescriptors.map( x => x.name ) }
    get displayProperties() { return this.propertyNames.filter( n => this.propertyDescriptor(n).display) }
    get defaultValues() { return _.fromPairs( this.propertyDescriptors.filter( pd => !pd.readOnly )
        .map( desc => [desc.name, EntityDescriptor.defaultValueForType(desc.type)]))  }

    validate(entity) {
        return _.fromPairs( this.propertyDescriptors.filter( pd => !pd.readOnly )
            .map( desc => [desc.name, desc.validate(entity)]))
    }

    static defaultValueForType(type) {
        switch (type) {
            case List:
                return new List()

            default:
                return null
        }
    }

    static forProperties(propertyTypeMap) {
        return new EntityDescriptor("anonymous", _.toPairs(propertyTypeMap).map( ([name, type]) => ({name, type})))
    }
}

module.exports = EntityDescriptor
