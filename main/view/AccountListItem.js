const React = require('react')
const {PropTypes} = require('react')

const AccountListItem = ({ name, code }) => (
    <li >
    {name}  -  {code}
    </li>
)

// Todo.propTypes = {
//     onClick: PropTypes.func.isRequired,
//     completed: PropTypes.bool.isRequired,
//     text: PropTypes.string.isRequired
// }

module.exports = {Todo}