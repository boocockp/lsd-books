const _ = require('lodash')
const React = require('react')
const {PropTypes} = require('react')
const {List} = require('immutable')
const EntityTable = require('./EntityTable')
const EntityTableRowGroup = require('./EntityTableRowGroup')

let TrialBalanceView = React.createClass({

    render: function () {

        const entity = this.props.entity
        const entityDescriptor = entity.constructor.entityDescriptor || this.props.entityDescriptor
        if (!entityDescriptor) throw new Error('EntityDescriptor required')
        const entityName = entityDescriptor.name
        const heading = `${entityName} ${entity.shortSummary || ''}`
        return (
            <div >
                <h2>{heading}</h2>
                <EntityTable items={entity["accounts"]} propertiesToShow={["code, itemLink", "name, itemLink", "debitBalance", "creditBalance"]}>
                    <EntityTableRowGroup className="summary"
                                        items={List([entity["totals"]])} propertiesToShow={["", "", "debit", "credit"]}
                                         entityDescriptor={entityDescriptor.propertyDescriptor("totals").type}/>
                </EntityTable>
            </div>
        )
    }})

TrialBalanceView.propTypes = {
    entity: PropTypes.object.isRequired
}

module.exports = TrialBalanceView