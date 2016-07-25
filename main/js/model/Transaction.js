const {Record, List} = require('immutable'),
    JsonUtil = require('../../../shared/modules/json/JsonUtil');

class Transaction extends Record({date: null, description: null, postings: new List()}) {

    constructor(date, description, postings) {
        super({date, description, postings: new List(postings)});
    }

    toJSON() {
        return Object.assign(super.toJSON(), {"@type": this.constructor.name});
    }

}

JsonUtil.registerClass(Transaction);
module.exports = Transaction;