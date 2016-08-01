const React = require('react')
const {PropTypes} = require('react')
const {FormGroup, ControlLabel, FormControl, HelpBlock} = require('react-bootstrap')

const FormSelectItem = React.createClass({
    getInitialState: function () {
        return {value: this.props.value}
    },
    handleChange: function (event) {
        const optionValue = event.target.value
        const value = this.props.options.find( x => x.name === optionValue) || null
        this.setState({value})
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    },
    render: function () {
        const fieldId = `id_${Math.floor(Math.random() * 1000000) + 1 }`
        const optionList = this.props.options.map( o => ({value: o.name, name: _.startCase(o.name.toLowerCase())}) )
        return (
            <FormGroup controlId={fieldId} >
                <ControlLabel>{this.props.label}</ControlLabel>
                <FormControl componentClass="select" value={this.state.value || ""} onChange={this.handleChange}>
                    { this.props.placeholder ? <option value="">{this.props.placeholder}</option> : ""}
                    {optionList.map( op => <option key={op.value} value={op.value}>{op.name}</option> )}
                </FormControl>
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
    }
})

FormSelectItem.propTypes = {
    value: PropTypes.object,
    options: PropTypes.array,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    help: PropTypes.string,
    onChange: PropTypes.func,
}

module.exports = FormSelectItem
