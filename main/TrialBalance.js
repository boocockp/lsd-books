const {sum, prop} = require('./FunctionHelpers');

module.exports = class TrialBalance {
    
    constructor(books) {
        this.books = books;
    }
    
    get accounts() {
        return this.books.accountViewsByName().filter(it => it.signedBalance !== 0 ).sortBy(prop('code'));
    }

    get debitTotal() {
        return this.accounts.map(it => it.debitBalance).reduce(sum);
    }

    get creditTotal() {
        return this.accounts.map(it => it.creditBalance).reduce(sum);
    }
};