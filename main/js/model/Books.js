const
    {JsonUtil} = require('lsd-storage'),
    {Record, List, Map} = require('immutable'),
    {prop} = require('./FunctionHelpers'),
    AccountData = require('./AccountData'),
    Transaction = () => require('./Transaction'),
    Account = require('./Account'),
    AccountAsAt = require('./AccountAsAt'),
    TrialBalance = require('./TrialBalance'),
    BalanceSheet = require('./BalanceSheet')

class Books extends Record({accounts: new Map(), transactions: new Map()}) {

    constructor() {
        super();
    }

    setAccount(data) {
        if (data instanceof AccountData) {
            return this.setIn(['accounts', data.id], data)
        } else {
            if (this.getIn(['accounts', data.id])) {
                return this.mergeIn(['accounts', data.id], data)
            } else {
                throw new Error("Cannot set plain object as new Account.  id=" + data.id)
            }
        }
    }

    setTransaction(transaction) {
        const entityExists = this.getIn(['transactions', transaction.id])
        const updatedState = entityExists ? this.mergeIn(['transactions', transaction.id], transaction) : this.setIn(['transactions', transaction.id], transaction)
        return updatedState
    }

    get accountModels() {
        return this.accounts.map( a => new Account(a, this.postingsForAccount(a)) )
    }
    get accountsByName() {
        return this.accountModels.toList().sortBy( it => it.name);
    }

    accountViews(fromDate = 0, toDate = Number.MAX_SAFE_INTEGER) {
        const postings = (acct) => this.postingsForAccount(acct, fromDate, toDate);
        return this.accounts.toList().map( it => new AccountAsAt(it, postings(it)) );
    }

    accountViewsByName(fromDate = 0, toDate = Number.MAX_SAFE_INTEGER) {
        return this.accountViews(fromDate, toDate).sortBy( x => x.name);
    }

    account(id) {
        return this.accountModels.get(id)
    }

    accountsOfType(t) {
        return this.accountModels.toList().filter( it => it.type === t).sortBy( it => it.code );
    }

    accountByCode(code) {
        return this.accountModels.find( it => it.code == code );
    }

    transaction(id) {
        return this.transactions.get(id)
    }

    get transactionsByDate() {
        return this.transactions.toList().sortBy( it => it.date);
    }

    postingsForAccount(acct, fromDate = 0, toDate = Number.MAX_SAFE_INTEGER) {
        function inDates(transaction) {
            return transaction.date >= fromDate && transaction.date <= toDate;
        }
        let postingLists = this.transactions.toList().filter(inDates)
                                            .sortBy(prop('date'))
                                            .map( t => t.transactionPostings.filter( p => p.account == acct.id ));
        return postingLists.flatten(1);
    }

    get trialBalance() {
        return new TrialBalance(this.accountModels);
    }
    
    balanceSheet(date) {
        return new BalanceSheet(this, date);
    }

    toJSON() {
        return Object.assign(super.toJSON(), {"@type": this.constructor.name});
    }

}

JsonUtil.registerClass(Books);
module.exports = Books;
