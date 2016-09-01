const AwsResource = require('./AwsResource');

class Role extends AwsResource {
    constructor(iam, nameInEnv) {
        super(iam, nameInEnv);
        this.policies = [];
    }

    trust(service) {
        this.trustedService = service.awsServiceName;
        return this;
    }

    withPolicies(...policies) {
        this.policies = this.policies.concat(policies);
        return this;
    }

    get arn() {
        return `arn:aws:iam::${this.environment.accountId}:role/${this.name}`;
    }

    requestResource() {
        return this.aws.getRole({RoleName: this.name}).promise()
    }

    createResource() {
        let params = {
            AssumeRolePolicyDocument: JSON.stringify(this.trustPolicyDocument),
            RoleName: this.name
        };

        return this.aws.createRole(params).promise();
    }

    postCreateResource() {
        let attachPolicy = (policy) => {
            return policy.create().then(() => this.aws.attachRolePolicy({ PolicyArn: policy.arn, RoleName: this.name}).promise() )
        };

        return Promise.all(this.policies.map(attachPolicy)).then( () => this );
    }

    get resourceNotFoundCode() {
        return 'NoSuchEntity'
    }

    updateFromResource(data) {
        this.roleId = data.Role.RoleId;
    }

    get trustPolicyDocument() {
        return {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Principal: {
                        Service: this.trustedService
                    },
                    Action: "sts:AssumeRole"
                }
            ]
        };
    }

    get logDescription() {
        return `Role ${this.name} ${this.roleId}`;
    }
}

module.exports = Role
