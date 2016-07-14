const React = require('react')
const {PropTypes} = require('react')
const AccountListItem = require('./AccountListItem')

const AccountList = React.createClass({
    getInitialState: function () {
        return {accounts: []}
    },

    render: function () {
        return (
            <ul>
                {this.state.accounts.map(acct =>
                    <AccountListItem
                        key={acct.id}
                        name={acct.name}
                        code={acct.code}
                    />
                )}
            </ul>
        )
    }
})

// AccountList.propTypes = {
//     todos: PropTypes.arrayOf(PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         completed: PropTypes.bool.isRequired,
//         text: PropTypes.string.isRequired
//     }).isRequired).isRequired,
//     onTodoClick: PropTypes.func.isRequired
// }

module.exports = AccountList