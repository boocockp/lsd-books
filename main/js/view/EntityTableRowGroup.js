const _ = require('lodash')
const React = require('react')
const {PropTypes} = require('react')
const {List} = require('immutable')
const {Table} = require('react-bootstrap')


let EntityTableRowGroup = React.createClass({

    render: function () {
        return (
            <tbody className={this.props.className}>
                {this.props.items.map((item, index) => this.dataRow(item, index)) }
            </tbody>
        )
    },

    entityDescriptor: function () {
        const items = this.props.items
        const entityDescriptor = this.props.entityDescriptor || (items.get(0) && items.get(0).constructor.entityDescriptor);
        if (!entityDescriptor) throw new Error('EntityDescriptor required') //TODO show no data message if no items and no entity descriptor
        return entityDescriptor

    },

    propertyNames: function () {
        return this.props.propertiesToShow || this.entityDescriptor().displayProperties
    },

    dataCell: function (name, item, index) {
        if (name) {
            const className = this.entityDescriptor().propertyDescriptor(name).type.name.toLowerCase()
            return <td  key={name} className={className}>{item[name]}</td>
        } else {
            return <td key={"empty" + index} className="empty"/>
        }
    },

    dataRow: function (item, index) {
        return (
            <tr key={item.id || index}>
                {this.propertyNames().map((name, index) => this.dataCell(name, item, index))}
            </tr>
        )
    }
})

EntityTableRowGroup.propTypes = {
    items: PropTypes.instanceOf(List).isRequired,
    entityDescriptor: PropTypes.object,
    propertiesToShow: PropTypes.arrayOf(PropTypes.string)
}

module.exports = EntityTableRowGroup