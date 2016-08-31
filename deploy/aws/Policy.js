const AwsResource = require('./AwsResource');
const {arnFromResource}  = require('./Util');

class Policy extends AwsResource {
    constructor(iam, nameInEnv) {
        super(iam, nameInEnv);
        this._statements = [];
    }

    get arn() {
        return `arn:aws:iam::${this.environment.accountId}:policy/${this.name}`;
    }

    allow(resource, ...actions) {
        this._statements.push({Effect: "Allow", Resource: arnFromResource(resource), Action: actions});
        return this;
    }

    requestResource() {
        return this.aws.getPolicy({PolicyArn: this.arn}).promise()
    }

    createResource() {
        let params = {
            PolicyDocument: JSON.stringify(this.policyDocument),
            PolicyName: this.name
        };

        return this.aws.createPolicy(params).promise();
    }

    get resourceNotFoundCode() {
        return 'NoSuchEntity'
    }


    updateFromResource(data) {
        this.policyId = data.Policy.PolicyId;
    }

    get policyDocument() {
        return {
            Version: "2012-10-17",
            Statement: this._statements
        };
    }

    get logDescription() {
        return `Policy ${this.name} ${this.policyId}`;
    }
}

module.exports = Policy
