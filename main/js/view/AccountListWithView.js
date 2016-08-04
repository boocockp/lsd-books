const React = require('react')
const { connect } = require('react-redux')
const {PropTypes} = require('react')
const {List} = require('immutable')
const EntityList = require('./EntityList')
const EntityView = require('./EntityView')
const AccountListItem = require('./AccountListItem')
const {Grid, Row, Col, Button} = require('react-bootstrap')
const Account = require('../model/Account')
const {setAccount} = require('../app/actions')


let AccountListWithView = React.createClass({
    render: function () {
        const p = this.props
        const selectedAccountId = p.selectedAccountId
        const account = p.selectedAccountId === "new" ? new Account() : p.accounts.find(a => a.id === selectedAccountId)
        const displayItemFn = (account) => <AccountListItem account={account} />
        const saveEntity = entity => {
            const newEntity = !entity.id
            const action = setAccount(entity);
            this.props.dispatch(action)
            if (newEntity) {
                this.newObjectSaved(action.data)
            }
        }
        return (
            <Grid>
                <Row>
                    <Col xs={12} md={3}>
                        {this.props.onNew ? <Button onClick={this.newObject}>New</Button> : ''}
                        <EntityList items={p.accounts} selectedItemId={selectedAccountId} onSelect={this.select} displayItem={displayItemFn}/>
                    </Col>
                    <Col xs={12} md={9}>{account ? <EntityView entity={account} onSave={saveEntity}
                                                               propertiesToShow={["name", "code", "type", "balance"]}/> : '' }</Col>
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

const mapStateToProps = (state) => {
    return {
        accounts: state.accountsByName
    }
}
AccountListWithView = connect(mapStateToProps)(AccountListWithView)

module.exports = AccountListWithView