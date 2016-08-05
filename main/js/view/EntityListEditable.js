const React = require('react')
const {PropTypes} = require('react')
const {List} = require('immutable')
const {Button, ListGroup, ListGroupItem} = require('react-bootstrap')

const EntityListEditable = React.createClass({
    render: function () {
        const renderDisplayItem = (item, index) => {
            return (
                <ListGroupItem key={item.id || index}
                               onClick={this.onEdit.bind(this, item)}>
                    {this.props.displayItem(item)}
                </ListGroupItem>
            )
        }
        const renderEditItem = (item, index) => {
            return (
                <ListGroupItem key={item.id || index}>
                    {this.props.editItem(item, this.onSave)}
                </ListGroupItem>
            )
        }

        const renderItem = (item, index) => {
            const isEditing = item === this.state.itemBeingEdited
            return isEditing ? renderEditItem(item, index) : renderDisplayItem(item, index)
        }

        const items = this.props.items
        const itemsToRender = this.state.indexBeingEdited === items.size ? items.push(this.state.itemBeingEdited) : items

        return (
            <div>
                <ListGroup>
                    { itemsToRender.map(renderItem) }
                </ListGroup>
                <Button onClick={this.onAdd}>New</Button>
            </div>
        )
    },

    getInitialState: function () {
        return {
            indexBeingEdited: null,
            itemBeingEdited: null
        }
    },

    onEdit: function (item) {
        console.log('onEdit', item)
        this.setState({itemBeingEdited: item, indexBeingEdited: this.props.items.indexOf(item)})
    },

    onAdd: function () {
        console.log('onAdd')
        const item = new this.props.itemType()
        this.setState({itemBeingEdited: item, indexBeingEdited: this.props.items.size})
    },

    onSave: function(updatedItem) {
        const updatedList = this.props.items.set(this.state.indexBeingEdited, updatedItem)
        this.props.onChange(updatedList)
        this.setState(this.getInitialState())
    },

    onCancelEdit: function() {
        this.setState(this.getInitialState())
    }
})

EntityListEditable.propTypes = {
    items: PropTypes.instanceOf(List).isRequired,
    itemType: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    displayItem: PropTypes.func.isRequired,
    editItem: PropTypes.func.isRequired
}

module.exports = EntityListEditable