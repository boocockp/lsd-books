// @flow

const {Record} = require('immutable'),
    JsonUtil = require('../../../shared/modules/json/JsonUtil')
    , {DebitCredit} = require('./Types')

class Posting extends Record({accountId: null, type: null, amount: null}) {
    
    constructor(accountId: string, type: DebitCredit, amount: number ) {
        super({accountId, type, amount})
    }
    toJSON() : Object {
        return Object.assign(super.toJSON(), {"@type": this.constructor.name});
    }

}

JsonUtil.registerClass(Posting);
module.exports = Posting;