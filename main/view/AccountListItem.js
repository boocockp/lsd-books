const React = require('react')
const {PropTypes} = require('react')

const AccountListItem = React.createClass({
    render: function () {
        return (
            <li >
                {this.props.name} - {this.props.code}
            </li>
        )
    }
});


// Todo.propTypes = {
//     onClick: PropTypes.func.isRequired,
//     completed: PropTypes.bool.isRequired,
//     text: PropTypes.string.isRequired
// }

module.exports = AccountListItem