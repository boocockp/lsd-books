const React = require('react')
const { connect } = require('react-redux')
const PersistentRouter = require('./PersistentRouter')
const AccountListWithView = require('./AccountListWithView')
const MainPage = require('./MainPage')
const NotFoundPage = require('./NotFoundPage')
const {Locations, Location, NotFound} = require('react-router-component')
const GoogleSignin = require('./GoogleSignin')

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
                <PersistentRouter hash ref={(c) => this._router = c}>
                    <Location path="/" handler={MainPage}/>
                    <Location path="/account" handler={this.accountList()}/>
                    <Location path="/account/:selectedAccountId" handler={this.accountList()}/>
                    <NotFound handler={NotFoundPage}/>
                </PersistentRouter>
            </div>
        )
    },

    navigateToAccount: function(id) {
        this._router.navigate(`/account/${id}`)
    },

    navigateToNewAccount: function() {
        this._router.navigate(`/account/new`)
    },

    accountList: function () {
        return (
            <AccountListWithView accounts={this.props.appState.accountsByName} onSelect={this.navigateToAccount} onNew={this.navigateToNewAccount}/>
        )
    }
})

App = connect(mapStateToProps)(App)

module.exports = App