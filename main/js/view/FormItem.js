const React = require('react')
const {PropTypes} = require('react')
const {FormGroup, ControlLabel, FormControl, HelpBlock} = require('react-bootstrap')
const {List} = require('immutable')

const ViewUtils = require('./ViewUtils')

const FormItem = React.createClass({
    getInitialState: function () {
        const fieldId = `id_${Math.floor(Math.random() * 1000000) + 1 }`
        return {value: this.props.value, fieldId}
    },
    handleChange: function (event) {
        const valueStr = event.target.value
        const value = valueStr === '' ? null : valueStr
        this.setState({value})
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    },

    handleSelectChange: function (event) {
        const optionValue = event.target.value
        const value = this.props.type.values().find( x => x.name === optionValue) || null
        this.setState({value})
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    },

    render: function () {
        return (
            <FormGroup controlId={this.state.fieldId} >
                <ControlLabel>{this.props.label}</ControlLabel>
                {this.formControl()}
                <FormControl.Feedback />
                {this.props.help ? <HelpBlock>{this.props.help}</HelpBlock> : ''}
            </FormGroup>
        )
    },

    getDefaultProps: function() {
        return {
            value: ''
        }
    },

    componentWillReceiveProps: function(props) {
        this.setState({value: props.value})
    },

    formControl: function() {
        const propDesc = this.props.propDesc
        const type = this.props.type
        const readOnly = this.props.readOnly
        const placeholder = readOnly ? "" : this.props.placeholder
        const value = (this.state.value === undefined || this.state.value === null) ? "" : this.state.value
        if (readOnly) {
            return <FormControl.Static>{value}</FormControl.Static>
        }
        if (type === String) {
            return <FormControl type="text" value={value} placeholder={placeholder} onChange={this.handleChange}/>
        }
        if (type === Number) {
            return <FormControl type="text" value={value} placeholder={placeholder} onChange={this.handleChange}/>
        }
        if (type === List) {
            return <EntityList items={value} displayItem={ViewUtils.displayViewFactory(propDesc.itemType)}
                                editItem={ViewUtils.editViewFactory(propDesc.itemType)}/>
        }
        if (type.values) {
            const optionList = type.values().map( o => ({value: o.name, name: o.label}) )
            return (
                <FormControl componentClass="select" value={value} onChange={this.handleSelectChange}>
                    <option value="">{placeholder || "Not selected"}</option>
                    {optionList.map( op => <option key={op.value} value={op.value}>{op.name}</option> )}
                </FormControl>
                )

        }
    }
})

FormItem.propTypes = {
    propDesc: PropTypes.object,
    value: PropTypes.any,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    help: PropTypes.string,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
}

module.exports = FormItem
