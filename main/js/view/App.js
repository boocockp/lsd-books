const React = require('react')
const {PropTypes} = require('react')
const { connect } = require('react-redux')
const PersistentRouter = require('./PersistentRouter')
const EntityListWithView = require('./EntityListWithView')
const TrialBalanceView = require('./TrialBalanceView')
const MainPage = require('./MainPage')
const NotFoundPage = require('./NotFoundPage')
const {Locations, Location, NotFound} = require('react-router-component')
const GoogleSignin = require('./GoogleSignin')
const Account = require('../model/Account')
const Transaction = require('../model/Transaction')
const EntityManager = require('./EntityManager')
const {setAccount, setTransaction} = require('../app/actions')

const config = {
    "clientId": "919408445147-a0csgn7e21d773ilrif3q8d9hfrfc7vm.apps.googleusercontent.com",
    "identityPoolId": "eu-west-1:c46e1da2-72cf-4965-92b8-ebe270684050",
    "bucketName": "ashridgetech.reactbooks-test"
}

const mapStateToProps = (state) => {
    return {
        appState: state
    }
}

let App = React.createClass({
    render: function () {
        return (
            <div>
                <h1>ReactBooks</h1>
                <div id="googleLogin">
                    <GoogleSignin clientId={config.clientId}/>
                </div>
                <Locations hash ref={(c) => this._router = c}>
                    <Location path="/" handler={MainPage}/>
                    <Location path="/account" handler={this.accountList()}/>
                    <Location path="/account/:selectedId" handler={this.accountList()}/>
                    <Location path="/transaction" handler={this.transactionList()}/>
                    <Location path="/transaction/:selectedId" handler={this.transactionList()}/>
                    <Location path="/reports/trialBalance" handler={this.trialBalance()}/>
                    <NotFound handler={NotFoundPage}/>
                </Locations>
            </div>
        )
    },

    navigateToAccount: function(id) {
        this._router.navigate(`/account/${id}`)
    },

    navigateToNewAccount: function() {
        this._router.navigate(`/account/new`)
    },

    navigateToTransaction: function(id) {
        this._router.navigate(`/transaction/${id}`)
    },

    navigateToNewTransaction: function() {
        this._router.navigate(`/transaction/new`)
    },

    accountList: function () {
        return (
            <EntityListWithView entityManager={this.getEntityManager(Account)}
                                onSelect={this.navigateToAccount} onNew={this.navigateToNewAccount}/>
        )
    },

    transactionList: function () {
        return (
            <EntityListWithView entityManager={this.getEntityManager(Transaction)}
                                onSelect={this.navigateToTransaction} onNew={this.navigateToNewTransaction}/>
        )
    },

    trialBalance: function () {
        return <TrialBalanceView entity={this.props.appState.trialBalance}/>
    },

    getEntityManager: function (entityType) {
        const appState = this.props.appState
        const dispatch = this.props.dispatch

        class TransactionManager extends EntityManager {

            get(id) {
                return appState.transactions.get(id)
            }

            choiceList() {
                return appState.transactionsByDate
            }

            newInstance() {
                return new Transaction();
            }

            save(entity) {
                const action = setTransaction(entity);
                dispatch(action)
                return action.data
            }
        }

        class AccountManager extends EntityManager {

            get(id) {
                return appState.account(id)
            }

            choiceList() {
                return appState.accountsByName
            }

            newInstance() {
                return new Account();
            }

            save(entity) {
                const action = setAccount(entity.data);
                dispatch(action)
                return action.data
            }
        }

        if (entityType === Account) {
            return new AccountManager()
        }

        if (entityType === Transaction) {
            return new TransactionManager()
        }

        throw new Error("Unknown entityType " + entityType)

    },

    getChildContext() {
        return {getEntityManager: this.getEntityManager}
    }
})

App.childContextTypes = {
    getEntityManager: PropTypes.func
}


App = connect(mapStateToProps)(App)

module.exports = App