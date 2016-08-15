// @flow

const {Record} = require('immutable'),
    _ = require('lodash')
    , {JsonUtil} = require('lsd-storage')
    , {DebitCredit} = require('./Types')
    , Account = () => require('./Account')
    , {EntityDescriptor, Reference} = require('lsd-metadata')

const descriptor = new EntityDescriptor("Posting",[
    {
        name: "account",
        type: Reference,
        get itemType() { return Account()},
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
])

class Posting extends Record(descriptor.defaultValues) {

    static get entityDescriptor() : Object {
        return descriptor
    }

    constructor(data : Object) {
        super(data)
    }

    setData(name, value) {
        return this.set(name, value)
    }

    toJSON() : Object {
        return Object.assign(super.toJSON(), {"@type": this.constructor.name});
    }

}

JsonUtil.registerClass(Posting);
module.exports = Posting;