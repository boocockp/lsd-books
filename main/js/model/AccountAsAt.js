const {CREDIT} = require('./Types').DebitCredit;



module.exports = class AccountAsAt {

    constructor(account, postings) {
        this.account = account;
        this.postings = postings;
        this.id = account.id;
        this.name = account.name;
        this.code = account.code;
        this.type = account.type;
    }

    get signedBalance() {
        const signedAmount = (p) => p.type == CREDIT ? p.amount : -p.amount;
        const sum = (acc, val) => acc + val;
        return this.postings.map(signedAmount).reduce(sum, 0);
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

};