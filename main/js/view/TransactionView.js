const React = require('react')
const { connect } = require('react-redux')
const {PropTypes} = require('react')
const Transaction = require('../model/Transaction')
const EntityView = require('./EntityView')
const {setTransaction} = require('../app/actions')

let TransactionView = React.createClass({
    render: function () {
        const updateEntity = data => this.props.dispatch(setTransaction(data))
        const addEntity = data => {
            const action = setTransaction(data);
            this.props.dispatch(action)
            if (this.props.onNewObjectSaved) {
                this.props.onNewObjectSaved(action.data)
            }
        }
        return (
            <EntityView entity={this.props.transaction} onUpdateEntity={updateEntity} onAddEntity={addEntity}
                        propertiesToShow={["date", "description", "postings"]}/>
        )
    },

})

TransactionView = connect()(TransactionView)

TransactionView.propTypes = {
    transaction: PropTypes.instanceOf(Transaction).isRequired,
    onNewObjectSaved: PropTypes.func
}

module.exports = TransactionView