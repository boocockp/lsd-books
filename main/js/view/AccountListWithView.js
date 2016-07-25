const React = require('react')
const {PropTypes} = require('react')
const {List} = require('immutable')
const AccountList = require('./AccountList')
const AccountView = require('./AccountView')
const {Grid, Row, Col} = require('react-bootstrap')


const AccountListWithView = React.createClass({
    render: function () {
        const p = this.props
        const selectedAccountId = parseInt(p.selectedAccountId)
        const account = selectedAccountId ? p.accounts.find( a => a.id === selectedAccountId) : null
        return (
            <Grid>
                <Row>
                    <Col xs={12} md={3}><AccountList accounts={p.accounts} selectedAccountId={selectedAccountId} onSelect={this.select}/></Col>
                    <Col xs={12} md={9}>{account ? <AccountView account={account}/> : '' }</Col>
                </Row>
            </Grid>
        )
    },

    select: function(account) {
        this.props.onSelect && this.props.onSelect(account.id)
    }
})

AccountListWithView.propTypes = {
    accounts: PropTypes.instanceOf(List).isRequired,
    selectedAccountId: PropTypes.string,
    onSelect: PropTypes.func,
}

module.exports = AccountListWithView