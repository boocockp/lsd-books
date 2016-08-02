// @flow

const {Record} = require('immutable'),
    JsonUtil = require('../../../shared/modules/json/JsonUtil')
    , {DebitCredit} = require('./Types')

class Posting2  {

    accountId: string;
    type: DebitCredit;
    amount: number;
    
    toJSON() : Object {
        // TODO how to avoid repeating all property names
        return Object.assign({"@type": this.constructor.name, accountId: this.accountId, type: this.type, amount: this.amount});
    }

}

JsonUtil.registerClass(Posting2);
module.exports = Posting2;