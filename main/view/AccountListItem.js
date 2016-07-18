const React = require('react')
const {PropTypes} = require('react')
const Account = require('../model/Account')

const AccountListItem = ({account, onClick}) => (
        <span>{account.code} &nbsp; {account.name}</span>
)


AccountListItem.propTypes = {
    account: PropTypes.instanceOf(Account).isRequired,
}

module.exports = AccountListItem