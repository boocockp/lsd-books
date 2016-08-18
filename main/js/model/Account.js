const _ = require('lodash'),
    {Record, List} = require('immutable'),
    {JsonUtil} = require('lsd-storage'),
    {CREDIT} = require('./Types').DebitCredit,
    AccountData = require('./AccountData'),
    TransactionPosting = require('./TransactionPosting'),
    {EntityDescriptor} = require('lsd-metadata')


const descriptor =  new EntityDescriptor( "Account",
    AccountData.entityDescriptor.propertyDescriptors.concat([
    {
        name: "shortSummary",
        type: String,
        computed: true,
        display: false,
        description: "Code and name of this account"
    },
    {
        name: "balance",
        type: Number,
        computed: true,
        description: "The current balance of the account"
    },
    {
        name: "debitBalance",
        type: Number,
        computed: true,
        display: false,
        description: "The current balance of the account if it is a debit balance, otherwise empty"
    },
    {
        name: "creditBalance",
        type: Number,
        computed: true,
        display: false,
        description: "The current balance of the account if it is a credit balance, otherwise empty"
    },
    {
        name: "postings",
        type: List,
        itemType: TransactionPosting,
        editable: false,
        description: "The debits and credits to the account"
    }
]))


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