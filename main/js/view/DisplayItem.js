const React = require('react')
const {PropTypes} = require('react')
const {List} = require('immutable')
const moment = require('moment')
const EntityList = require('./EntityList');
const EntityListItem = () => require('./EntityListItem');
const Reference = require('../model/Reference')

const DisplayItem = React.createClass({
    render: function () {
        return <span className={this.props.className}>{this.displayValue()}</span>
    },

    getDefaultProps: function() {
        return {
            value: ''
        }
    },

    displayValue: function() {
        const propDesc = this.props.propDesc
        const type = propDesc.type
        const value = this.props.value
        if (type === String) {
            return value
        }
        if (type === Number) {
            return value
        }
        if (type === Date) {
            const displayFormat = "DD MMM YY"
            return moment(value).format(displayFormat)
        }
        if (type === List) {
            const EntityListItemType = EntityListItem()
            const displayItemFn = (item) => <EntityListItemType item={item} />
            return <EntityList items={value} itemType={propDesc.itemType} displayItem={displayItemFn} />
        }
        if (type === Reference) {
            const entity = this.context.getEntityManager(propDesc.itemType).get(value)
            return entity.shortSummary
        }
        if (type.values) {
            return value.label
        }

        return value.toString()
    }
})

DisplayItem.propTypes = {
    propDesc: PropTypes.object.isRequired,
    value: PropTypes.any,
}

DisplayItem.contextTypes = {
    getEntityManager: PropTypes.func
}

module.exports = DisplayItem
