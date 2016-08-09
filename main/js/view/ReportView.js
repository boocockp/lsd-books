const _ = require('lodash')
const React = require('react')
const {PropTypes} = require('react')
const FormItem = require('./FormItem')

let ReportView = React.createClass({

    render: function () {
        const entity = this.props.entity
        const entityDescriptor = entity.constructor.entityDescriptor || this.props.entityDescriptor
        if (!entityDescriptor) throw new Error('EntityDescriptor required')
        const entityName = entityDescriptor.name
        const propertyNames = this.props.propertiesToShow || entityDescriptor.displayProperties
        const heading = `${entityName} ${entity.shortSummary}`
        return (
            <div >
                <h2>{heading}</h2>
                <div>
                    {propertyNames.map( name => this.formItem(entityDescriptor.propertyDescriptor(name), entity[name]) )}
                </div>
            </div>
        )
    },

    formItem: function(propDesc, value) {
        if (propDesc.type === List) {

        }
        return <FormItem key={propDesc.name} type={propDesc.type} readOnly={true} value={value} label={propDesc.label}
                         help={propDesc.help} propDesc={propDesc}/>
    }
})

ReportView.propTypes = {
    entity: PropTypes.object.isRequired,
    entityDescriptor: PropTypes.object,
    propertiesToShow: PropTypes.arrayOf(PropTypes.string)
}

module.exports = ReportView