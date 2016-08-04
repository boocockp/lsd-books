// @flow

const {List, Record} = require('immutable'),
    JsonUtil = require('../../../shared/modules/json/JsonUtil')
    , {DebitCredit} = require('./Types')

const propertyDescriptors = [
    {
        name: "accountId",
        type: String,
        description: "The account for this posting"
    },
    {
        name: "type",
        type: DebitCredit,
        description: "Debit or Credit"
    },
    {
        name: "amount",
        type: Number,
        description: "The amount posted to this account"
    },
    {
        name: "shortSummary",
        type: String,
        readOnly: true,
        description: "Date and description of this transaction"
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
    name: "Posting",
    propertyNames: propertyDescriptors.map( x => x.name ),
    propertyDescriptor: function(name) {
        return Object.assign({name, label: _.startCase(name)}, propertyDescriptors.find( x => x.name === name ))
    },
    get displayProperties() { return ["accountId", "type", "amount"] },
    get defaultValues() { return _.fromPairs( propertyDescriptors.filter( pd => !pd.readOnly ).map( desc => [desc.name, defaultValueForType(desc.type)]))  }
}

class Posting extends Record(descriptor.defaultValues) {

    static get entityDescriptor() : Object {
        return descriptor
    }

    get shortSummary() {
        return `${this.accountId}  ${this.type}  ${this.amount}`
    }

    toJSON() : Object {
        return Object.assign(super.toJSON(), {"@type": this.constructor.name});
    }

}

JsonUtil.registerClass(Posting);
module.exports = Posting;