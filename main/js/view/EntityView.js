const _ = require('lodash')
const React = require('react')
const {PropTypes} = require('react')
const FormItem = require('./FormItem')

let EntityView = React.createClass({

    componentWillMount: function () {
        this.setState({entity: this.props.entity})
    },

    render: function () {
        const entity = this.state.entity
        const entityDescriptor = entity.constructor.entityDescriptor || this.props.entityDescriptor
        if (!entityDescriptor) throw new Error('EntityDescriptor required')
        const entityName = entityDescriptor.name
        const propertyNames = this.props.propertiesToShow
        return (
            <div >
                <h2>{entity.id ? `${entityName} ${entity.shortSummary}` : `New ${entityName}`}</h2>
                <form>
                    {propertyNames.map( name => this.formItem(entityDescriptor.propertyDescriptor(name), entity[name]) )}
                </form>
                <button type="submit" className="btn btn-default" onClick={this.onSave}>Save</button>
            </div>
        )
    },

    onChange: function(name, value) {
        const oldEntity = this.state.entity
        const entity = oldEntity.set(name, value)
        this.setState({entity})
    },

    onSave: function(e) {
        const entity = this.state.entity;
        console.log('save', entity.toJS())
        e.preventDefault()
        this.props.onSave(entity)
    },

    formItem: function(propDesc, value) {
        const changeFn = this.onChange.bind(this, propDesc.name)
        return <FormItem key={propDesc.name} type={propDesc.type} readOnly={propDesc.readOnly} onChange={changeFn} value={value} label={propDesc.label}
                         placeholder={propDesc.description} help={propDesc.help} propDesc={propDesc}/>
    }
})

EntityView.propTypes = {
    entityDescriptor: PropTypes.object,
    entity: PropTypes.object.isRequired,
    propertiesToShow: PropTypes.arrayOf(PropTypes.string),
    onSave: PropTypes.func.isRequired
}

module.exports = EntityView