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
const NavigationManager = require('superviews').NavigationManager

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
        const accountNav = this.getNavigationManager(Account)
        const transactionNav = this.getNavigationManager(Transaction)
        return (
            <div>
                <h1>ReactBooks</h1>
                <div id="googleLogin">
                    <GoogleSignin clientId={config.clientId}/>
                </div>
                <Locations hash ref={(c) => this._router = c}>
                    <Location path="/" handler={MainPage}/>
                    <Location path={accountNav.listPath} handler={this.accountList()}/>
                    <Location path={accountNav.selectedPath} handler={this.accountList()}/>
                    <Location path={transactionNav.listPath} handler={this.transactionList()}/>
                    <Location path={transactionNav.selectedPath} handler={this.transactionList()}/>
                    <Location path="/reports/trialBalance" handler={this.trialBalance()}/>
                    <NotFound handler={NotFoundPage}/>
                </Locations>
            </div>
        )
    },

    accountList: function () {
        return (
            <EntityListWithView entityManager={this.getEntityManager(Account)} entityViewType={AccountView}
                                navigationManager={this.getNavigationManager(Account)}/>
        )
    },

    transactionList: function () {
        return (
            <EntityListWithView entityManager={this.getEntityManager(Transaction)}
                                navigationManager={this.getNavigationManager(Transaction)}/>
        )
    },

    trialBalance: function () {
        return <TrialBalanceView entity={this.state.appState.trialBalance}/>
    },

    getNavigationManager: function(entityType) {
        return new NavigationManager(entityType, () => this._router)
    },

    getEntityManager: function (entityType) {
        const appStore = this.props.appStore
        const appState = appStore.state.value

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
        return {getEntityManager: this.getEntityManager, getNavigationManager: this.getNavigationManager}
    }
})

App.childContextTypes = {
    getEntityManager: PropTypes.func,
    getNavigationManager: PropTypes.func
}

module.exports = App