const React = require('react')
const {PropTypes} = require('react')
const {FormGroup, ControlLabel, FormControl, HelpBlock} = require('react-bootstrap')

const FormItem = React.createClass({
    getInitialState: function () {
        return {value: this.props.value};
    },
    handleChange: function (event) {
        const value = event.target.value;
        this.setState({value});
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    },
    render: function () {
        const fieldId = `id_${Math.floor(Math.random() * 1000000) + 1 }`
        return (
            <FormGroup controlId={fieldId} >
                <ControlLabel>{this.props.label}</ControlLabel>
                <FormControl type="text" value={this.state.value} placeholder={this.props.placeholder} onChange={this.handleChange} />
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

FormItem.propTypes = {
    value: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    help: PropTypes.string,
    onChange: PropTypes.func,
}

module.exports = FormItem
