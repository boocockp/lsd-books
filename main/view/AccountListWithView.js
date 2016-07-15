const React = require('react')
const {PropTypes} = require('react')
const {List} = require('immutable')
const AccountList = require('./AccountList')
const AccountView = require('./AccountView')

const AccountListWithView = React.createClass({
    render: function () {
        const p = this.props, s = this.state;
        return (
            <div className="row">
                <div className="col-md-3">
                    <AccountList accounts={p.accounts} onSelect={this.select}/>
                </div>
                <div className="col-md-9">
                    {s.selectedAccount ? <AccountView account={s.selectedAccount}/> : '' }
                </div>
            </div>
        )
    },

    select: function(account) {
        this.setState({selectedAccount: account})
    },

    getInitialState: function () { return {} }
})

AccountListWithView.propTypes = {
    accounts: PropTypes.instanceOf(List).isRequired,
}

module.exports = AccountListWithView