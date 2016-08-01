const React = require('react')
const { connect } = require('react-redux')
const {PropTypes} = require('react')
const Account = require('../model/Account')
const {AccountType} = require('../model/Types')
const FormItem = require('./FormItem')
const FormSelectItem = require('./FormSelectItem')
const {addAccount, updateAccount, addTransaction} = require('../app/actions')

let AccountView = React.createClass({
    render: function () {
        this.formChanges = {}
        const change = (name) => (value) => this.onChange(name, value)
        const account = this.props.account
        return (
            <div >
                <h2>{account.id ? `Account ${account.code} - ${account.name}` : "New Account"}</h2>
                <form>
                    <FormItem onChange={change("name")} value={account.name} label="Name" placeholder="The descriptive name"/>
                    <FormItem onChange={change("code")} value={account.code} label="Code" placeholder="The account short code" help="Must be 4 digits"/>
                    <FormSelectItem onChange={change("type")} value={account.type} label="Type" placeholder="The type of account" options={AccountType.values()}/>
                </form>
                <button type="submit" className="btn btn-default" onClick={this.onSave}>Save</button>
            </div>
        )
    },

    onChange: function(name, value) {
        // console.log('change', name, value)
        this.formChanges[name] = value
    },

    onSave: function(e) {
        console.log('save', this.formChanges)
        e.preventDefault()
        if (this.props.account.id) {
            this.props.dispatch(updateAccount(Object.assign({id: this.props.account.id}, this.formChanges)))
        } else {
            const action = addAccount(Object.assign(this.formChanges));
            this.props.dispatch(action)
            if (this.props.onNewObjectSaved) {
                this.props.onNewObjectSaved(action.data)
            }
        }
    }
})

AccountView = connect()(AccountView)

AccountView.propTypes = {
    account: PropTypes.instanceOf(Account).isRequired,
    onNewObjectSaved: PropTypes.func
}

module.exports = AccountView