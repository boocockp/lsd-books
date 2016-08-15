const _ = require('lodash'),
    {Record, List} = require('immutable'),
    {JsonUtil} = require('lsd-storage'),
    {CREDIT} = require('./Types').DebitCredit,
    {EntityDescriptor, NotEmpty} = require('lsd-metadata'),
    {AccountType} = require('./Types')

const descriptor = new EntityDescriptor("AccountData", [
    {
        name: "id",
        type: String,
        display: false,
        description: "The unique identifier for this object"
    },
    {
        name: "name",
        type: String,
        description: "The descriptive name",
        validators: [NotEmpty() ]
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
])

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