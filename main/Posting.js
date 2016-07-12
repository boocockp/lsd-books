const {Record} = require('immutable');

class Posting extends Record({accountId: null, type: null, amount: null}) {
    
    constructor(accountId, type, amount) {
        super({accountId, type, amount})
    }
}

module.exports = Posting;