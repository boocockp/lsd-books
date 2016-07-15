const React = require('react')
const {PropTypes} = require('react')

const AccountListItem = ({name, code}) => (
    <li >
        {name} - {code}
    </li>
)


AccountListItem.propTypes = {
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
}

module.exports = AccountListItem