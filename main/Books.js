let _instance;

const 
    // Memoize = require('../../shared/modules/memoize/Memoize'),
    // Observe = require('../../shared/modules/observe/Observe'),
    JsonUtil = require('../shared/modules/json/JsonUtil'),
    {Record, List, Map} = require('immutable'),
    Account = () => require('./Account'),
    AccountAsAt = require('./AccountAsAt')
    // TrialBalance = require('./TrialBalance'),
    // BalanceSheet = require('./BalanceSheet')
    ;

class Books extends Record({accounts: new Map(), transactions: new List()}) {
    
    static get instance() {
        return _instance || (_instance = new Books());
    }
    
    constructor() {
        super();
    }

    addAccount(data) {
        const account = new (Account())(data);
        return this.setIn(['accounts', account.id], account);
    }

    updateAccount(id, data) {
        return this.mergeIn(['accounts', id], data);
    }
    
    addTransaction(transaction) {
        return this.update('transactions', l => l.push(transaction));
    }
    
    get accountsByName() {
        return this.accounts.toList().sortBy( it => it.name);
    }

    accountViewsByName(fromDate = 0, toDate = Number.MAX_SAFE_INTEGER) {
        const postings = (acct) => this.postingsForAccount(acct, fromDate, toDate);
        return this.accountsByName.map( it => new AccountAsAt(it, postings(it)) );
    }

    account(id) {
        return this.getIn(['accounts', id]);
    }

    accountsOfType(t) {
        return this.accounts.toList().filter( it => it.type === t).sortBy( it => it.code );
    }

    accountByCode(code) {
        return this.accounts.find( it => it.code == code );
    }

    postingsForAccount(acct, fromDate = 0, toDate = Number.MAX_SAFE_INTEGER) {
        function inDates(transaction) {
            return transaction.date >= fromDate && transaction.date <= toDate;
        }
        let postingLists = this.transactions.filter(inDates).map( t => t.postings.filter( p => p.accountId == acct.id ));
        return postingLists.flatten(1);
    }

    get trialBalance() {
        return new TrialBalance(this);
    }
    
    balanceSheet(date) {
        return new BalanceSheet(this, date);
    }

    static get TEST_newInstance() {
        _instance = null;
        return Books.instance
    };

    dataChanged() {
        // Memoize.dataChanged();
        // Observe.dataChanged();
    }

    toJSON() {
        return Object.assign(super.toJSON(), {"@type": this.constructor.name});
    }


}

JsonUtil.registerClass(Books);
module.exports = Books;
