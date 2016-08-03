let _instance;

const 
    // Memoize = require('../../shared/modules/memoize/Memoize'),
    // Observe = require('../../shared/modules/observe/Observe'),
    JsonUtil = require('../../../shared/modules/json/JsonUtil'),
    {Record, List, Map} = require('immutable'),
    actions = require('../app/actions'),
    Account = () => require('./Account'),
    Transaction = () => require('./Transaction'),
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
                return actions.updateAccount(account.toJS())
            } else {
                return actions.addAccount(account.toJS())
            }
        }
        return this.setIn(['accounts', account.id], account).set('$actionForLatestUpdate', updateAction());
    }

    addAccount(data) {
        const account = new (Account())(data);
        return this.setIn(['accounts', account.id], account);
    }

    updateAccount(data) {
        return this.mergeIn(['accounts', data.id], data);
    }
    
    setTransaction(transaction) {
        const updateAction = () => {
            if (this.getIn(['transactions', transaction.id])) {
                return actions.updateTransaction(transaction.toJS())
            } else {
                return actions.addTransaction(transaction.toJS())
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
    
    get accountsByName() {
        return this.accounts.toList().sortBy( it => it.name);
    }

    accountViews(fromDate = 0, toDate = Number.MAX_SAFE_INTEGER) {
        const postings = (acct) => this.postingsForAccount(acct, fromDate, toDate);
        return this.accounts.toList().map( it => new AccountAsAt(it, postings(it)) );
    }

    accountViewsByName(fromDate = 0, toDate = Number.MAX_SAFE_INTEGER) {
        return this.accountViews(fromDate, toDate).sortBy( x => x.name);
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

    toJSON() {
        return Object.assign(super.toJSON(), {"@type": this.constructor.name});
    }

}

JsonUtil.registerClass(Books);
module.exports = Books;
