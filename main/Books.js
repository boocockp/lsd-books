let _instance;

const 
    // Memoize = require('../../shared/modules/memoize/Memoize'),
    // Observe = require('../../shared/modules/observe/Observe'),
    // JsonUtil = require('../../shared/modules/json/JsonUtil'),
    {Record, List, Map} = require('immutable'),
    Account = () => require('./Account')
    // TrialBalance = require('./TrialBalance'),
    // BalanceSheet = require('./BalanceSheet')
    ;

class Books extends Record({accounts: new Map()}) {
    
    static get instance() {
        return _instance || (_instance = new Books());
    }
    
    static toStoreJson(obj) {
        return {accounts: obj._accounts, transactions: obj._transactions};
    }

    static fromStoreJson(data) {
        return Object.assign(new Books(), {_accounts: data.accounts, _transactions: data.transactions} )
    }

    constructor() {
        super();
    }

    addAccount(data) {
        const account = new (Account())(data);
        return this.setIn(['accounts', account.id], account);
    }

    updateAccount(code, details) {
        let acc = this.accountByCode(code);
        Object.assign(acc, details);
        this.dataChanged();
    }
    
    addTransaction(transaction) {
        this._transactions.push(transaction);
        this.dataChanged();
    }
    
    get accountsByName() {
        return this.accounts.toList().sortBy( it => it.name);
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
        let postingLists = this._transactions.filter(inDates).map( t => t.postings.filter( p => p.accountCode == acct.code ));
        return [].concat(...postingLists);
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

}


module.exports = Books;
