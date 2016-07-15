const React = require('react')
const {PropTypes} = require('react')
const AccountListItem = require('./AccountListItem')
const {List} = require('immutable')

const AccountList = React.createClass({
    render: function () {
        return (
            <ul className="list-unstyled">
                {this.props.accounts.map(acct =>
                    <AccountListItem
                        key={acct.id}
                        account={acct}
                        onClick={this.onClick.bind(this, acct)}
                    />
                )}
            </ul>
        )
    },

    getDefaultProps: function() {
        return {accounts: []}
    },

    onClick: function(acct) {
        console.log('onClick', acct)

        const onSelect = this.props.onSelect;
        if (onSelect) {
            onSelect(acct)
        }
    }
})

AccountList.propTypes = {
    accounts: PropTypes.instanceOf(List).isRequired,
    onSelect: PropTypes.func
}

module.exports = AccountList