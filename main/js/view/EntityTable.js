const _ = require('lodash')
const React = require('react')
const {PropTypes} = require('react')
const {List} = require('immutable')
const {Table} = require('react-bootstrap')
const EntityTableRowGroup = require('./EntityTableRowGroup')


let EntityTable = React.createClass({

    render: function () {
        return (
            <Table striped bordered condensed hover>
                <thead>
                    <tr>
                        {this.propertyNames().map( (name, index) => this.headerCell(name, index) )}
                    </tr>
                </thead>
                <EntityTableRowGroup items={this.props.items} propertiesToShow={this.props.propertiesToShow}/>
                {this.props.children}
            </Table>
        )
    },

    entityDescriptor: function() {
        const items = this.props.items
        const entityDescriptor = this.props.entityDescriptor || (items.get(0) && items.get(0).constructor.entityDescriptor);
        if (!entityDescriptor) throw new Error('EntityDescriptor required') //TODO show no data message if no items and no entity descriptor
        return entityDescriptor

    },

    propertyNames: function() {
        return this.props.propertiesToShow || this.entityDescriptor().displayProperties
    },

    headerCell: function(name, index) {
        return <th key={index}>{this.entityDescriptor().propertyDescriptor(name).label}</th>
    }

})

EntityTable.propTypes = {
    items: PropTypes.instanceOf(List).isRequired,
    entityDescriptor: PropTypes.object,
    propertiesToShow: PropTypes.arrayOf(PropTypes.string)
}

module.exports = EntityTable