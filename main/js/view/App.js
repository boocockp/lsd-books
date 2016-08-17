const React = require('react')
const {PropTypes} = require('react')
const {EntityListWithView, GoogleSignin} = require('lsd-views')
const TrialBalanceView = require('./TrialBalanceView')
const AccountView = require('./AccountView')
const MainPage = require('./MainPage')
const {NotFoundPage, NavigationManager} = require('lsd-views')
const {Locations, Location, NotFound} = require('react-router-component')
const Account = require('../model/Account')
const Transaction = require('../model/Transaction')
const EntityManagers = require('./EntityManagers')

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
                    <GoogleSignin clientId={this.props.googleClientId}/>
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
        return EntityManagers.getManager(appStore, entityType)
    },

    getChildContext() {
        return {getEntityManager: this.getEntityManager, getNavigationManager: this.getNavigationManager}
    }
})

App.childContextTypes = {
    getEntityManager: PropTypes.func,
    getNavigationManager: PropTypes.func
}

App.propTypes = {
    appStore: PropTypes.object.isRequired,
    googleClientId: PropTypes.string.isRequired
}

module.exports = App