const {Record} = require('immutable'),
    // Books = require('./Books'),
    {CREDIT} = require('./Types').DebitCredit;

class Account extends Record({id: null, name: null, code: null, type: null}) {

    constructor(data = {}) {
        super(data);
    }

    get signedBalance() {
        // const signedAmount = (p) => p.type == CREDIT ? p.amount : -p.amount;
        // const sum = (acc, val) => acc + val;
        // return Books.instance.postingsForAccount(this).map(signedAmount).reduce(sum, 0);
        return 0;
    }

    get balance() {
        const sign = this.type.normalBalanceType == CREDIT ? 1 : -1;
        return this.signedBalance * sign;
    }

    get debitBalance() {
        return this.signedBalance < 0 ? Math.abs(this.signedBalance) : null;
    }

    get creditBalance() {
        return this.signedBalance > 0 ? this.signedBalance : null;
    }

}

module.exports = Account;