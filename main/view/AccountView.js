const React = require('react')
const {PropTypes} = require('react')
const Account = require('../model/Account')

const AccountView = React.createClass({
    render: function () {
        const acct = this.props.account;
        return (
            <div >
                <h2>Account {acct.code} - {acct.name}</h2>
                <div className="row">
                    <div className="col-md-3">
                        <label>Type</label>
                    </div>
                    <div className="col-md-6">
                        <span>{acct.type.name}</span>
                    </div>
                </div>
            </div>
        )
    }
})

AccountView.propTypes = {
    account: PropTypes.instanceOf(Account).isRequired,
}

module.exports = AccountView