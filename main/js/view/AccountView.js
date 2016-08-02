const React = require('react')
const { connect } = require('react-redux')
const {PropTypes} = require('react')
const Account = require('../model/Account')
const {AccountType} = require('../model/Types')
const EntityView = require('./EntityView')
const {addAccount, updateAccount} = require('../app/actions')

let AccountView = React.createClass({
    render: function () {
        const updateEntity = data => this.props.dispatch(updateAccount(data))
        const addEntity = data => {
            const action = addAccount(data);
            this.props.dispatch(action)
            if (this.props.onNewObjectSaved) {
                this.props.onNewObjectSaved(action.data)
            }
        }
        return (
            <EntityView entity={this.props.account} onUpdateEntity={updateEntity} onAddEntity={addEntity}/>
        )
    },

})

AccountView = connect()(AccountView)

AccountView.propTypes = {
    account: PropTypes.instanceOf(Account).isRequired,
    onNewObjectSaved: PropTypes.func
}

module.exports = AccountView