const {Record, List} = require('immutable');

class Transaction extends Record({date: null, description: null, postings: new List()}) {

    constructor(date, description, postings) {
        super({date, description, postings: new List(postings)});
    }

}

module.exports = Transaction;