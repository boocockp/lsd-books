const React = require('react')
const {PropTypes} = require('react')

const AccountList = ({accounts}) => (
    <ul>
        {accounts.map(acct =>
            <AccountListItem
                key={acct.id}
                {...acct}
            />
        )}
    </ul>
)

// AccountList.propTypes = {
//     todos: PropTypes.arrayOf(PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         completed: PropTypes.bool.isRequired,
//         text: PropTypes.string.isRequired
//     }).isRequired).isRequired,
//     onTodoClick: PropTypes.func.isRequired
// }

module.exports = {AccountList}