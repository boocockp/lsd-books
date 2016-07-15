const React = require('react')
const { connect } = require('react-redux')
const {PropTypes} = require('react')
const Account = require('../model/Account')
const FormItem = require('./FormItem')
const {addAccount, updateAccount, addTransaction} = require('../app/actions')

const accountViewClass = React.createClass({
    render: function () {
        this.formChanges = {}
        const acct = this.props.account;
        const change = (name) => (value) => this.onChange(name, value)
        return (
            <div >
                <h2>Account {acct.code} - {acct.name}</h2>
                <form>
                    <FormItem onChange={change("name")} value={acct.name} label="Code" placeholder="The descriptive name"/>
                    <FormItem onChange={change("code")} value={acct.code} label="Code" placeholder="The account short code"/>
                    <FormItem onChange={change("type")} value={acct.type.name} label="Type" placeholder="The type of account"/>
                </form>
                <button type="submit" className="btn btn-default" onClick={this.onSave}>Save</button>
            </div>
        )
    },

    onChange: function(name, value) {
        console.log('change', name, value)
        this.formChanges[name] = value
    },

    onSave: function(e) {
        console.log('save', this.formChanges)
        e.preventDefault()
        this.props.dispatch(updateAccount(this.props.account.id, this.formChanges))
    }
})

const AccountView = connect()(accountViewClass)

AccountView.propTypes = {
    account: PropTypes.instanceOf(Account).isRequired,
}

module.exports = AccountView