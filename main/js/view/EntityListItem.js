const React = require('react')
const {PropTypes} = require('react')

const EntityListItem = ({item}) => (
        <span>{item.shortSummary}</span>
)

EntityListItem.propTypes = {
    item: PropTypes.object.isRequired,
}

module.exports = EntityListItem