const React = require('react')
const {PropTypes} = require('react')

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
            <div className="form-group">
                <label htmlFor={fieldId}>Type</label>
                <input type="text" className="form-control" id={fieldId} name={this.props.name} placeholder={this.props.placeholder}
                       value={this.state.value}
                       onChange={this.handleChange}/>
            </div>
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
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
}

module.exports = FormItem
