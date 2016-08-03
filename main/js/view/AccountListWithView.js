const React = require('react')
const {PropTypes} = require('react')
const {List} = require('immutable')
const EntityList = require('./EntityList')
const AccountListItem = require('./AccountListItem')
const AccountView = require('./AccountView')
const {Grid, Row, Col, Button} = require('react-bootstrap')
const Account = require('../model/Account')


const AccountListWithView = React.createClass({
    render: function () {
        const p = this.props
        const selectedAccountId = p.selectedAccountId
        const account = p.selectedAccountId === "new" ? new Account() : p.accounts.find(a => a.id === selectedAccountId)
        const displayItemFn = (account) => <AccountListItem account={account} />
        return (
            <Grid>
                <Row>
                    <Col xs={12} md={3}>
                        {this.props.onNew ? <Button onClick={this.newObject}>New</Button> : ''}
                        <EntityList items={p.accounts} selectedItemId={selectedAccountId} onSelect={this.select} displayItem={displayItemFn}/>
                    </Col>
                    <Col xs={12} md={9}>{account ? <AccountView account={account} onNewObjectSaved={this.newObjectSaved}/> : '' }</Col>
                </Row>
            </Grid>
        )
    },

    select: function(account) {
        this.props.onSelect && this.props.onSelect(account.id)
    },

    newObject: function() {
        this.props.onNew && this.props.onNew()
    },

    newObjectSaved: function(data) {
        this.select(data)
    }
})

AccountListWithView.propTypes = {
    accounts: PropTypes.instanceOf(List).isRequired,
    selectedAccountId: PropTypes.string,
    onSelect: PropTypes.func,
    onNew: PropTypes.func,
}

module.exports = AccountListWithView