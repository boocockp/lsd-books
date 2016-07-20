const React = require('react')
const {PropTypes} = require('react')
const GoogleLogin = require('react-google-login')['default']

const GoogleSignin = React.createClass({
    render: function () {
        return (
            <GoogleLogin callback={this._onSignIn} clientId={this.props.clientId}/>
        )
    },

    getDefaultProps: function() {
        return {accounts: []}
    },

    _onSignIn: function(auth) {
        const authResponse = auth.getAuthResponse();
        const event = new CustomEvent('googleSignIn', {detail: { authResponse }} );
        document.dispatchEvent(event)
    }
})

GoogleSignin.propTypes = {
    clientId: PropTypes.func.isRequired
}

module.exports = GoogleSignin