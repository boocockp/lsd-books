const {Record} = require('immutable'),
    JsonUtil = require('../shared/modules/json/JsonUtil');

class Posting extends Record({accountId: null, type: null, amount: null}) {
    
    constructor(accountId, type, amount) {
        super({accountId, type, amount})
    }
    toJSON() {
        return Object.assign(super.toJSON(), {"@type": this.constructor.name});
    }

}

JsonUtil.registerClass(Posting);
module.exports = Posting;