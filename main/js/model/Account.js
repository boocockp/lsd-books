// @flow

const _ = require('lodash'),
    {Record} = require('immutable'),
    JsonUtil = require('../../../shared/modules/json/JsonUtil'),
    // Books = require('./Books'),
    {CREDIT} = require('./Types').DebitCredit,
    {AccountType} = require('./Types')
    , Posting2 = require('./Posting2')

// type AccountData = {
//         name?: string,
//     code?: number,
//     type?: AccountType
//     }

const propertyDescriptors = [
    {
        name: "id",
        type: String,
        placeholder: "The unique identifier for this object"
    },
    {
        name: "name",
        type: String,
        placeholder: "The descriptive name"
    },
    {
        name: "code",
        type: Number,
        maxLength: 4,
        placeholder: "The account short code",
        help: "Must be 4 digits"
    },
    {
        name: "type",
        type: AccountType,
        placeholder: "The type of account"
    }
]
const descriptor =  {
        name: "Account",
        propertyNames: propertyDescriptors.map( x => x.name ),
        propertyDescriptor: function(name) {
            return Object.assign({name, label: _.startCase(name)}, propertyDescriptors.find( x => x.name === name ))
        },
        get defaultValues() { return _.fromPairs( propertyDescriptors.map( desc => [desc.name, null]))  }
}

class Account extends Record(descriptor.defaultValues) {

    static get entityDescriptor() : Object {
        return descriptor
    }

    constructor(data : Object) {
        super(data)
    }

    get description() : string {
        return `${this.code} - ${this.name}`
    }

    //@precision(2)
    get signedBalance() : number {
        // const signedAmount = (p) => p.type == CREDIT ? p.amount : -p.amount
        // const sum = (acc, val) => acc + val
        // return Books.instance.postingsForAccount(this).map(signedAmount).reduce(sum, 0)
        return 0
    }

    get balance() : number {
        const sign = this.type.normalBalanceType == CREDIT ? 1 : -1
        return this.signedBalance * sign
    }

    get debitBalance() : ?number {
        return this.signedBalance < 0 ? Math.abs(this.signedBalance) : null
    }

    get creditBalance() : ?number {
        return this.signedBalance > 0 ? this.signedBalance : null
    }

    toJSON() : Object {
        return Object.assign(super.toJSON(), {"@type": this.constructor.name})
    }

}

const account1 = new Account({name: "23"} )

JsonUtil.registerClass(Account)
module.exports = Account