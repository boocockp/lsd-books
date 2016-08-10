// @flow

const _ = require('lodash'),
    {Record, List} = require('immutable'),
    JsonUtil = require('../../../shared/modules/json/JsonUtil'),
    {CREDIT} = require('./Types').DebitCredit,
    AccountData = require('./AccountData'),
    Posting = require('./Posting'),
    Reference = require('./Reference'),
    Transaction = () => require('./Transaction'),
    EntityDescriptor = require('../metadata/EntityDescriptor')


let descriptor

function makeDescriptor() {
    return new EntityDescriptor("TransactionPosting",
        Posting.entityDescriptor.propertyDescriptors.concat([
            {
                name: "id",
                type: String,
                description: "The unique identifier for this object"
            },
            {
                name: "transaction",
                type: Reference,
                get itemType() {
                    return Transaction()
                },
                description: "The transaction for this posting"
            },
            Transaction().entityDescriptor.propertyDescriptor("date"),
            Transaction().entityDescriptor.propertyDescriptor("description"),
            Posting.entityDescriptor.propertyDescriptor("account"),
            Posting.entityDescriptor.propertyDescriptor("type"),
            Posting.entityDescriptor.propertyDescriptor("amount")
        ]))
}


class TransactionPosting extends Record({transactionData: null, posting: null, index: null}) {

    static get entityDescriptor(): Object {
        return descriptor || (descriptor = makeDescriptor())
    }

    constructor(transactionData: Transaction, posting: Posting, index: number) {
        super({transactionData, posting, index})
    }

    get id() {
        return this.transactionData.id + "-" + this.index
    }

    get transaction() {
        return this.transactionData.id
    }

    get date() {
        return this.transactionData.date
    }

    get description() {
        return this.transactionData.description
    }

    get account() {
        return this.posting.account
    }

    get type() {
        return this.posting.type
    }

    get amount() {
        return this.posting.amount
    }

    toJSON(): Object {
        throw new Error('Should not be serializing this object')
    }

}

JsonUtil.registerClass(TransactionPosting)
module.exports = TransactionPosting