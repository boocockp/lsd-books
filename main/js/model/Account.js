const _ = require('lodash'),
    {Record, List} = require('immutable'),
    JsonUtil = require('../../../shared/modules/json/JsonUtil'),
    // Books = require('./Books'),
    {CREDIT} = require('./Types').DebitCredit,
    {AccountType} = require('./Types')
    , Posting2 = require('./Posting2')

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
        name: "shortSummary",
        type: String,
        readOnly: true,
        description: "Code and name of this account"
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
    },
    {
        name: "balance",
        type: Number,
        readOnly: true,
        description: "The current balance of the account"
    },
    {
        name: "debitBalance",
        type: Number,
        readOnly: true,
        description: "The current balance of the account if it is a debit balance, otherwise empty"
    },
    {
        name: "creditBalance",
        type: Number,
        readOnly: true,
        description: "The current balance of the account if it is a credit balance, otherwise empty"
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
    name: "Account",
    propertyNames: propertyDescriptors.map( x => x.name ),
    propertyDescriptor: function(name) {
        return Object.assign({name, label: _.startCase(name)}, propertyDescriptors.find( x => x.name === name ))
    },
    get defaultValues() { return _.fromPairs( propertyDescriptors.filter( pd => !pd.readOnly ).map( desc => [desc.name, defaultValueForType(desc.type)]))  }
}

class Account extends Record(descriptor.defaultValues) {

    static get entityDescriptor() : Object {
        return descriptor
    }

    constructor(data : Object) {
        super(data)
    }

    get shortSummary() : string {
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
        const sign = this.type ? (this.type.normalBalanceType == CREDIT ? 1 : -1) : 0
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

JsonUtil.registerClass(Account)
module.exports = Account