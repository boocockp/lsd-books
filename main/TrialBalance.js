function sum(acc, val) {
    return (acc === undefined ? 0 : acc) + val;
}

function prop(propertyName) {
    return it => it[propertyName];
}

module.exports = class TrialBalance {
    
    constructor(books) {
        this._books = books;
    }
    
    get accounts() {
        return this._books.accountViewsByName().filter( it => it.signedBalance !== 0 ).sortBy(prop('code'));
    }

    get debitTotal() {
        return this.accounts.map(it => it.debitBalance).reduce(sum);
    }

    get creditTotal() {
        return this.accounts.map(it => it.creditBalance).reduce(sum);
    }
};