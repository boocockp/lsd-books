const _ = require('lodash')
const React = require('react')
const {PropTypes} = require('react')
const {List} = require('immutable')
const {Table} = require('react-bootstrap')
const {Link} = require('react-router-component')
const {parseProp} = require('./Util')

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

    propertiesToShow: function () {
        return (this.props.propertiesToShow || this.entityDescriptor().displayProperties).map( parseProp )
    },

    dataCell: function (propInfo, item, index) {
        const {name} = propInfo
        if (name) {
            const typeClassName = this.entityDescriptor().propertyDescriptor(name).type.name.toLowerCase()
            const text = item[name]
            const content = propInfo.itemLink ? this.itemLink(item, text) : text
            return <td key={name} className={typeClassName}>{content}</td>
        } else {
            return <td key={"empty" + index} className="empty"/>
        }
    },

    itemLink: function(item, text) {
        const entityManager = this.context.getEntityManager(item.constructor)
        return <Link href={entityManager.linkHref(item)}>{text}</Link>
    },

    dataRow: function (item, index) {
        return (
            <tr key={item.id || index}>
                {this.propertiesToShow().map((prop, index) => this.dataCell(prop, item, index))}
            </tr>
        )
    }
})

EntityTableRowGroup.propTypes = {
    items: PropTypes.instanceOf(List).isRequired,
    entityDescriptor: PropTypes.object,
    propertiesToShow: PropTypes.arrayOf(PropTypes.string)
}

EntityTableRowGroup.contextTypes = {
    getEntityManager: PropTypes.func
}

module.exports = EntityTableRowGroup