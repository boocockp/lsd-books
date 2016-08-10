import List from 'immutable'

class EntityDescriptor {
    constructor(name, propertyDescriptors) {
        Object.assign(this, {name, propertyDescriptors})
    }
    propertyDescriptor(name) {
        const desc = this.propertyDescriptors.find(x => x.name === name )
        if (!desc) {
            throw new Error(`No property ${name} in type ${this.name}`)
        }
        return Object.assign({name, label: _.startCase(name)}, desc)
    }
    get propertyNames() { return this.propertyDescriptors.map( x => x.name ) }
    get displayProperties() { return this.propertyNames.filter( n => this.propertyDescriptor(n).display !== false) }
    get defaultValues() { return _.fromPairs( this.propertyDescriptors.filter( pd => !pd.readOnly )
        .map( desc => [desc.name, EntityDescriptor.defaultValueForType(desc.type)]))  }

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
