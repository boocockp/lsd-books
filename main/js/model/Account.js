const _ = require('lodash'),
    {Record, List} = require('immutable'),
    JsonUtil = require('../../../shared/modules/json/JsonUtil'),
    {CREDIT} = require('./Types').DebitCredit,
    AccountData = require('./AccountData'),
    Posting = require('./Posting'),
    EntityDescriptor = require('../metadata/EntityDescriptor'),
    {AccountType} = require('./Types')


const descriptor =  new EntityDescriptor( "Account", [
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
        type: String,
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
        display: false,
        description: "The current balance of the account if it is a debit balance, otherwise empty"
    },
    {
        name: "creditBalance",
        type: Number,
        readOnly: true,
        display: false,
        description: "The current balance of the account if it is a credit balance, otherwise empty"
    },
    {
        name: "postings",
        type: List,
        itemType: Posting,
        readOnly: true,
        description: "The debits and credits to the account"
    }
])


class Account extends Record({data: new AccountData(), postings: List()}) {

    static get entityDescriptor() : Object {
        return descriptor
    }

    constructor(data : AccountData = new AccountData(), postings: List = List()) {
        super({data, postings})
    }

    get id() { return this.data.id }
    get name() { return this.data.name }
    get code() { return this.data.code }
    get type() { return this.data.type }

    setData(name, value) {
        return this.setIn(['data', name], value)
    }

    get shortSummary() : string {
        return `${this.code} - ${this.name}`
    }

    //@precision(2)
    get signedBalance() : number {
        const signedAmount = (p) => p.type == CREDIT ? p.amount : -p.amount
        const sum = (acc, val) => acc + val
        return this.postings.map(signedAmount).reduce(sum, 0)
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
        throw new Error('Should not be serializing this object')
    }

}

JsonUtil.registerClass(Account)
module.exports = Account