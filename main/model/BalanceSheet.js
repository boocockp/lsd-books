const AccountAsAt = require('./AccountAsAt'),
    {sum, prop} = require('./FunctionHelpers'),
    {FIXED_ASSET, CURRENT_ASSET, LONG_TERM_LIABILITY, CURRENT_LIABILITY, CAPITAL, EXPENSE, REVENUE} = require('./Types').AccountType;

class AccountGroup {
    constructor(books, date, accountType) {
        this.books = books;
        this.date = date;
        this.accountType = accountType;
    }

    get accounts() {
        const accountType = a => a.type == this.accountType;
        const nonZeroBalance = a => a.signedBalance != 0;
        return this.books.accountViews(0, this.date).filter(accountType).filter(nonZeroBalance).sortBy(prop('code'));
    }

    get total() {
        return this.accounts.map(prop('balance')).reduce(sum);
    }

}

module.exports = class BalanceSheet {

    constructor(books, date) {
        this.books = books;
        this.date = date;
    }

    get fixedAssets() {
        return new AccountGroup(this.books, this.date, FIXED_ASSET);
    }


    get currentAssets() {

    }

    get longTermLiabilities() {

    }

    get currentLiabilities() {

    }

    get capitalReserves() {  //TODO this needs P&L too
        return new AccountGroup(this.books, this.date, CAPITAL);
    }

    get netCurrentAssets() {

    }

    get totalAssetsLessCurrentLiabilities() {

    }

    get totalAssetsLessTotalLiabilities() {

    }
};

