const React = require('react')
const {PropTypes} = require('react')
const {List} = require('immutable')
const {ListGroup, ListGroupItem} = require('react-bootstrap')

const EntityList = React.createClass({
    render: function () {
        const renderItem = (item, index) => {
            return (
                <ListGroupItem key={item.id || index}
                               active={item.id === this.props.selectedItemId}
                               onClick={this.onClick.bind(this, item)}>
                    {this.props.displayItem(item)}
                </ListGroupItem>
            )
        }
        const items = this.props.items

        return (
            <ListGroup>
                { items.map(renderItem) }
            </ListGroup>
        )
    },

    getDefaultProps: function () {
        return {items: []}
    },

    onClick: function (item) {
        console.log('onClick', item)

        const onSelect = this.props.onSelect
        if (onSelect) {
            onSelect(item)
        }
    }
})

EntityList.propTypes = {
    items: PropTypes.instanceOf(List).isRequired,
    selectedItemId: PropTypes.string,
    onSelect: PropTypes.func,
    displayItem: PropTypes.func.isRequired
}

module.exports = EntityList