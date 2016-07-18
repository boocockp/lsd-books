const React = require('react')
const {PropTypes} = require('react')
const {List} = require('immutable')
const AccountList = require('./AccountList')
const AccountView = require('./AccountView')
const {Grid, Row, Col} = require('react-bootstrap')


const AccountListWithView = React.createClass({
    render: function () {
        const p = this.props, s = this.state;
        const account = s.selectedAccountId ? p.accounts.find( a => a.id === s.selectedAccountId) : null
        return (
            <Grid>
                <Row>
                    <Col xs={12} md={3}><AccountList accounts={p.accounts} selectedAccountId={s.selectedAccountId} onSelect={this.select}/></Col>
                    <Col xs={12} md={9}>{account ? <AccountView account={account}/> : '' }</Col>
                </Row>
            </Grid>
        )
    },

    select: function(account) {
        this.setState({selectedAccountId: account.id})
    },

    getInitialState: function () { return {
        selectedAccountId: parseInt(this.props.routedId)
    } }
})

AccountListWithView.propTypes = {
    accounts: PropTypes.instanceOf(List).isRequired,
    selectedAccountId: PropTypes.string
}

module.exports = AccountListWithView