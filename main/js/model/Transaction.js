// @flow

const {Record, List} = require('immutable'),
    _ = require('lodash')
    , JsonUtil = require('../../../shared/modules/json/JsonUtil')
    , Posting = require('./Posting')
    , moment = require('moment')

const propertyDescriptors = [
    {
        name: "id",
        type: String,
        description: "The unique identifier for this object"
    },
    {
        name: "date",
        type: Date,
        description: "The effective date of the transaction"
    },
    {
        name: "description",
        type: String,
        description: "What the transaction was for"
    },
    {
        name: "shortSummary",
        type: String,
        readOnly: true,
        description: "Date and description of this transaction"
    },
    {
        name: "postings",
        type: List,
        itemType: Posting,
        description: "The amounts debited and credited to each account"
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
    name: "Transaction",
    propertyNames: propertyDescriptors.map( x => x.name ),
    propertyDescriptor: function(name) {
        return Object.assign({name, label: _.startCase(name)}, propertyDescriptors.find( x => x.name === name ))
    },
    get displayProperties() { return ["date", "description", "postings"] },
    get defaultValues() { return _.fromPairs( propertyDescriptors.filter( pd => !pd.readOnly ).map( desc => [desc.name, defaultValueForType(desc.type)]))  }
}

class Transaction extends Record(descriptor.defaultValues) {

    static get entityDescriptor() : Object {
        return descriptor
    }

    constructor(data : Object = {}) {
        super(Object.assign({}, data, {postings: List(data.postings)}))
    }

    get shortSummary() {
        const formattedDate = this.date ? moment(this.date).format("DD MMM YY") : ""
        return `${formattedDate}  ${this.description}`
    }

    toJSON() : Object {
        return Object.assign(super.toJSON(), {"@type": this.constructor.name});
    }

}

JsonUtil.registerClass(Transaction);
module.exports = Transaction;