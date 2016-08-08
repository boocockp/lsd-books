const _ = require('lodash'),
    {Record, List} = require('immutable'),
    JsonUtil = require('../../../shared/modules/json/JsonUtil'),
    // Books = require('./Books'),
    {CREDIT} = require('./Types').DebitCredit,
    {AccountType} = require('./Types')

const propertyDescriptors = [
    {
        name: "id",
        type: String,
        description: "The unique identifier for this object"
    },
    {
        name: "name",
        type: String,
        description: "The descriptive name"
    },
    {
        name: "code",
        type: Number,
        maxLength: 4,
        description: "The account short code",
        help: "Must be 4 digits"
    },
    {
        name: "type",
        type: AccountType,
        description: "The type of account"
    }
]

function defaultValueForType(type) {
    switch (type) {
        case List:
            return new List()

        default:
            return null
    }
}

const descriptor =  {
    name: "AccountData",
    propertyNames: propertyDescriptors.map( x => x.name ),
    propertyDescriptor: function(name) {
        return Object.assign({name, label: _.startCase(name)}, propertyDescriptors.find( x => x.name === name ))
    },
    get displayProperties() { return [] },
    get defaultValues() { return _.fromPairs( propertyDescriptors.filter( pd => !pd.readOnly ).map( desc => [desc.name, defaultValueForType(desc.type)]))  }
}

class AccountData extends Record(descriptor.defaultValues) {

    static get entityDescriptor() : Object {
        return descriptor
    }

    constructor(data : Object) {
        super(data)
    }

    toJSON() : Object {
        return Object.assign(super.toJSON(), {"@type": this.constructor.name})
    }

}

JsonUtil.registerClass(AccountData)
module.exports = AccountData