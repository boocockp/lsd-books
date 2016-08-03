const React = require('react')
const {PropTypes} = require('react')
const {List} = require('immutable')
const {ListGroup, ListGroupItem} = require('react-bootstrap')

const EntityList = React.createClass({
    render: function () {
        const renderDisplayItem = (item) => {
            return (
                <ListGroupItem key={item.id}
                               active={item.id === this.props.selectedItemId}
                               onClick={this.onClick.bind(this, item)}>
                    {this.props.displayItem(item)}
                </ListGroupItem>
            )
        }
        const renderEditItem = (item) => {
            return (
                <ListGroupItem key={item.id}>
                    {this.props.editItem(item)}
                </ListGroupItem>
            )
        }

        const renderItem = (item) => {
            const isEditing = item === this.state.itemBeingEdited
            return isEditing ? renderEditItem(item) : renderDisplayItem(item)
        }

        return (
            <ListGroup>
                { this.props.items.map(renderItem) }
            </ListGroup>
        )
    },

    getDefaultProps: function () {
        return {items: []}
    },

    getInitialState: function () {
        return {
            itemBeingEdited: null
        }
    },

    onClick: function (item) {
        console.log('onClick', item)

        const editItem = this.props.editItem
        const onSelect = this.props.onSelect
        if (editItem) {
            this.state.itemBeingEdited = item
        } else if (onSelect) {
            onSelect(item)
        }
    }
})

EntityList.propTypes = {
    items: PropTypes.instanceOf(List).isRequired,
    selectedItemId: PropTypes.string,
    onSelect: PropTypes.func,
    displayItem: PropTypes.func,
    editItem: PropTypes.func
}

module.exports = EntityList