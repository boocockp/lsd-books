let AwsResource = require('./AwsResource')
let {arnFromResource}  = require('./Util')

module.exports = class Bucket extends AwsResource {

    constructor(s3, nameInEnv) {
        super(s3, nameInEnv)
        this._statements = []
    }

    get name() {
        return super.name.replace(/_/g, '-')
    }

    get arn() {
        return `arn:aws:s3:::${this.name}`
    }

    objectsPrefixed(prefix) {
        return `${this.arn}/${prefix}/*`
    }

    get allObjects() {
        return `${this.arn}/*`
    }

    allowServiceFromThisAccount(service, resource, ...actions) {
        this._statements.push({
            Effect: "Allow",
            Principal: {
                Service: [
                    service
                ]
            },
            Resource: arnFromResource(resource),
            Action: actions,
            Condition: {
                StringEquals: {
                    "aws:Referer": this.environment.accountId
                }
            }
        })
        return this
    }

    allowCognitoFolderAccess(prefix) {
        this._statements.push({
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:ListBucket"],
            Resource: [this.arn],
            Condition: {"StringLike": {"s3:prefix": [prefix + "${cognito-identity.amazonaws.com:sub}/*"]}}
        })
        this._statements.push({
                Effect: "Allow",
                Principal: "*",
                Action: [
                    "s3:GetObject",
                    "s3:PutObject"
                ],
                Resource: [this.arn + "/" + prefix + "/${cognito-identity.amazonaws.com:sub}/*"]
            }
        )

        return this
    }

    allowCors(...methods) {
        this.corsMethods = methods.length ? methods : ['GET', 'HEAD', 'PUT']
        return this
    }


    requestResource() {
        return this.aws.headBucket({Bucket: this.name}).promise()
    }

    createResource() {
        return this.aws.createBucket({Bucket: this.name}).promise()
    }

    postCreateResource() {
        return this.aws.putBucketPolicy({
            Bucket: this.name,
            Policy: JSON.stringify(this.policy)
        }).promise().then( this._configureCors.bind(this) )
    }

    get resourceNotFoundCode() {
        return 'NotFound'
    }

    updateFromResource(data) {
        // nothing to do
    }

    get logDescription() {
        return `Bucket ${this.name}`
    }

    get policy() {
        return {
            "Version": "2012-10-17",
            "Statement": this._statements
        }
    }

    _configureCors() {
        if (!(this.corsMethods && this.corsMethods.length)) {
            return Promise.resolve()
        }
        var params = {
            Bucket: this.name,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedMethods: this.corsMethods,
                        AllowedOrigins: ['*'],
                        AllowedHeaders: ['*'],
                        MaxAgeSeconds: 300
                    }
                ]
            }
        }
        return this.aws.putBucketCors(params).promise()

    }
}

