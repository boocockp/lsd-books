let _instance;

const 
    // Memoize = require('../../shared/modules/memoize/Memoize'),
    // Observe = require('../../shared/modules/observe/Observe'),
    JsonUtil = require('../../../shared/modules/json/JsonUtil'),
    {Record, List, Map} = require('immutable'),
    actions = require('../app/actions'),
    AccountData = () => require('./AccountData'),
    Transaction = () => require('./Transaction'),
    Account = require('./Account'),
    AccountAsAt = require('./AccountAsAt'),
    TrialBalance = require('./TrialBalance'),
    BalanceSheet = require('./BalanceSheet')
    ;

class Books extends Record({accounts: new Map(), transactions: new Map(), $actionForLatestUpdate: null}) {
    
    static get instance() {
        return _instance || (_instance = new Books());
    }
    
    constructor() {
        super();
    }

    setAccount(account) {
        const updateAction = () => {
            if (this.getIn(['accounts', account.id])) {
                return actions.updateAccount(account)
            } else {
                return actions.addAccount(account)
            }
        }
        return this.setIn(['accounts', account.id], account).set('$actionForLatestUpdate', updateAction());
    }

    addAccount(data) {
        const account = new (AccountData())(data);
        return this.setIn(['accounts', account.id], account);
    }

    updateAccount(data) {
        return this.mergeIn(['accounts', data.id], data);
    }
    
    setTransaction(transaction) {
        const updateAction = () => {
            if (this.getIn(['transactions', transaction.id])) {
                return actions.updateTransaction(transaction)
            } else {
                return actions.addTransaction(transaction)
            }
        }
        return this.setIn(['transactions', transaction.id], transaction).set('$actionForLatestUpdate', updateAction());
    }

    addTransaction(data) {
        const transaction = new (Transaction())(data);
        return this.setIn(['transactions', transaction.id], transaction);
    }

    updateTransaction(data) {
        return this.mergeIn(['transactions', data.id], data);
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

    get transactionsByDate() {
        return this.transactions.toList().sortBy( it => it.date);
    }

    postingsForAccount(acct, fromDate = 0, toDate = Number.MAX_SAFE_INTEGER) {
        function inDates(transaction) {
            return transaction.date >= fromDate && transaction.date <= toDate;
        }
        let postingLists = this.transactions.toList().filter(inDates).map( t => t.postings.filter( p => p.account == acct.id ));
        return postingLists.flatten(1);
    }

    get trialBalance() {
        return new TrialBalance(this.accountModels);
    }
    
    balanceSheet(date) {
        return new BalanceSheet(this, date);
    }

    static get TEST_newInstance() {
        _instance = null;
        return Books.instance
    };

    toJSON() {
        return Object.assign(super.toJSON(), {"@type": this.constructor.name});
    }

}

JsonUtil.registerClass(Books);
module.exports = Books;
