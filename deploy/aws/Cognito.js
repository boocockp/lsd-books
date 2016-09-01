let AWS = require('aws-sdk')
let IdentityPool = require('./IdentityPool')

module.exports = class Cognito {

    constructor(env) {
        this.environment = env
        this.cognito = this.awsService = new AWS.CognitoIdentity()
    }

    identityPool(name, googleClientId) {
        return this.environment.add(new IdentityPool(this, name, googleClientId))
    }
}


