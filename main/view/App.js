const React = require('react')
const PersistentRouter = require('./PersistentRouter')
const VisibleAccountList = require('./VisibleAccountList')
const MainPage = require('./MainPage')
const NotFoundPage = require('./NotFoundPage')
const {Locations, Location, NotFound} = require('react-router-component')

const App = React.createClass({
    render: function () {
        return (
            <div>
                <h1>Books</h1>
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

    accountList: function () {
        return (
            <VisibleAccountList onSelect={this.navigateToAccount}/>
        )
    }


})

module.exports = App