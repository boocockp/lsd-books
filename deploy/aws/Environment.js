let AWS = require('aws-sdk')
let {logError} = require('./Util')

const SES = require('./SES')
const S3 = require('./S3')
const IAM = require('./IAM')
const Cognito = require('./Cognito')
const Lambda = require('./Lambda')
const Role = require('./Role')

function logResult(r) {
    console.log(r.resultDescription)
}

module.exports = class Environment {

    constructor(appName, envName, accountId) {
        Object.assign(this, {appName, envName, accountId})
        this.region = AWS.config.region
        console.log("Account Id", this.accountId, "Region", this.region)
        this.resources = []
    }

    get name() {
        return this.appName + "_" + this.envName
    }

    add(resource) {
        this.resources.push(resource)
        return resource
    }

    create() {
        return Promise.all(this.resources.map(r => r.create().then(logResult)))
    }

    destroy() {
        const roles = this.resources.filter( r => r instanceof Role)
        const others = this.resources.filter( r => !(r instanceof Role))
        return Promise.all(roles.map(r => r.destroy().then(logResult)))
            .then(() => Promise.all(others.map(r => r.destroy().then(logResult))))
    }

    get s3() { return this._s3 || (this._s3 = new S3(this)) }
    get iam() { return this._iam || (this._iam = new IAM(this)) }
    get ses() { return this._ses || (this._ses = new SES(this)) }
    get cognito() { return this._cognito || (this._cognito = new Cognito(this)) }
    get lambda() { return this._lambda || (this._lambda = new Lambda(this)) }

}

