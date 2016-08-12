const React = require('react')
const {PropTypes} = require('react')
const DisplayItem = require('./DisplayItem')

const EntityListItem = ({item}) => {
    if (item.shortSummary) {
        return <span>{item.shortSummary}</span>
    } else {
        const entityDescriptor = item.constructor.entityDescriptor
        if (entityDescriptor) {
            const displayProps = entityDescriptor.displayProperties
            const displayItem = (dp, index) => {
                const value = item[dp]
                const propDesc = entityDescriptor.propertyDescriptor(dp)
                return <DisplayItem className="spaced-1" value={value} propDesc={propDesc} key={index}/>
            }
            return <span> {displayProps.map(displayItem) } </span>
        } else {
            return <span>{item.toString()}</span>
        }
    }
}


EntityListItem.propTypes = {
    item: PropTypes.object.isRequired,
}

module.exports = EntityListItem