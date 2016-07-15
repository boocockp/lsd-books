const React = require('react')
const {PropTypes} = require('react')
const Account = require('../model/Account')

const AccountListItem = ({account, onClick}) => (
    <li onClick={onClick}>
        {account.code} &nbsp; {account.name}
    </li>
)


AccountListItem.propTypes = {
    account: PropTypes.instanceOf(Account).isRequired,
}

module.exports = AccountListItem