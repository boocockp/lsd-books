// @flow

const {Record, List} = require('immutable'),
    _ = require('lodash')
    , JsonUtil = require('../../../shared/modules/json/JsonUtil')
    , EntityDescriptor = require('../metadata/EntityDescriptor')
    , Posting = require('./Posting')
    , TransactionPosting = require('./TransactionPosting')
    , moment = require('moment')

const descriptor =  new EntityDescriptor("Transaction",[
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
])

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

    get transactionPostings() {
        return this.postings.map( (p, index) => new TransactionPosting(this, p, index) )
    }

    toJSON() : Object {
        return Object.assign(super.toJSON(), {"@type": this.constructor.name});
    }
}

JsonUtil.registerClass(Transaction);
module.exports = Transaction;