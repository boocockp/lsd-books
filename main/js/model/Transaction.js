// @flow

const {Record, List} = require('immutable'),
    JsonUtil = require('../../../shared/modules/json/JsonUtil')
    , Posting = require('./Posting')

class Transaction extends Record({date: null, description: null, postings: new List()}) {

    constructor(date: Date, description: string, postings: Array<Posting>) {
        super({date, description, postings: new List(postings)});
    }

    toJSON() : Object {
        return Object.assign(super.toJSON(), {"@type": this.constructor.name});
    }

}

JsonUtil.registerClass(Transaction);
module.exports = Transaction;