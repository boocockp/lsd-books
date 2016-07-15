const React = require('react')
const {PropTypes} = require('react')
const AccountListItem = require('./AccountListItem')
const {List} = require('immutable')

const AccountList = React.createClass({
    render: function () {
        return (
            <ul>
                {this.props.accounts.map(acct =>
                    <AccountListItem
                        key={acct.id}
                        name={acct.name}
                        code={acct.code}
                    />
                )}
            </ul>
        )
    },

    getDefaultProps: function() {
        return {accounts: []}
    }
})

AccountList.propTypes = {
    accounts: PropTypes.instanceOf(List).isRequired,
}

module.exports = AccountList