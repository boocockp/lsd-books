const React = require('react')
const {PropTypes} = require('react')
const uuid = require('node-uuid')
const EntityListWithView = require('superviews').EntityListWithView
const GoogleSignin = require('superviews').GoogleSignin
const TrialBalanceView = require('./TrialBalanceView')
const AccountView = require('./AccountView')
const MainPage = require('./MainPage')
const NotFoundPage = require('superviews').NotFoundPage
const {Locations, Location, NotFound} = require('react-router-component')
const Account = require('../model/Account')
const Transaction = require('../model/Transaction')
const EntityManager = require('superviews').EntityManager

const config = {
    "clientId": "919408445147-a0csgn7e21d773ilrif3q8d9hfrfc7vm.apps.googleusercontent.com",
    "identityPoolId": "eu-west-1:c46e1da2-72cf-4965-92b8-ebe270684050",
    "bucketName": "ashridgetech.reactbooks-test"
}

let App = React.createClass({

    componentWillMount: function() {
        this.props.appStore.state.sendTo( appState => this.setState({appState}) )
    },

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
            <EntityListWithView entityManager={this.getEntityManager(Account)} entityViewType={AccountView}
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
        return <TrialBalanceView entity={this.state.appState.trialBalance}/>
    },

    getEntityManager: function (entityType) {
        const appStore = this.props.appStore
        const appState = this.state.appState

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
                const entityWithId = entity.id ? entity : entity.merge({id: uuid.v4()})
                appStore.updateAndSave("setTransaction", entityWithId)
                return entityWithId
            }

            linkHref(entityOrId) {
                const id = entityOrId instanceof Transaction ? entityOrId.id : entityOrId
                return "/transaction/" + id;
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
                const {data} = entity
                const entityWithId = data.id ? data : data.merge({id: uuid.v4()})
                appStore.updateAndSave("setAccount", entityWithId)
                return entityWithId
            }

            linkHref(entityOrId) {
                const id = entityOrId instanceof Account ? entityOrId.id : entityOrId
                return "/account/" + id;
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

module.exports = App