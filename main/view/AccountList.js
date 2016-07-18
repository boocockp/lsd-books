const React = require('react')
const {PropTypes} = require('react')
const AccountListItem = require('./AccountListItem')
const {List} = require('immutable')
const {ListGroup, ListGroupItem} = require('react-bootstrap')

const AccountList = React.createClass({
    render: function () {
        return (
            <ListGroup>
                {this.props.accounts.map(acct =>
                    <ListGroupItem key={acct.id}
                                   active={acct.id === this.props.selectedAccountId}
                                   onClick={this.onClick.bind(this, acct)}>
                        <AccountListItem account={acct} />
                    </ListGroupItem>
                )}
            </ListGroup>
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