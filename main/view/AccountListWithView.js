const React = require('react')
const {PropTypes} = require('react')
const {List} = require('immutable')
const AccountList = require('./AccountList')
const AccountView = require('./AccountView')
const {Grid, Row, Col} = require('react-bootstrap')


const AccountListWithView = React.createClass({
    render: function () {
        const p = this.props, s = this.state;
        return (
            <Grid>
                <Row className="borders">
                    <Col xs={12} md={3}><AccountList accounts={p.accounts} onSelect={this.select}/></Col>
                    <Col xs={12} md={9}>{s.selectedAccountId ? <AccountView account={p.accounts.find( a => a.id === s.selectedAccountId)}/> : '' }</Col>
                </Row>
            </Grid>
        )
    },

    select: function(account) {
        this.setState({selectedAccountId: account.id})
    },

    getInitialState: function () { return {} }
})

AccountListWithView.propTypes = {
    accounts: PropTypes.instanceOf(List).isRequired,
}

module.exports = AccountListWithView