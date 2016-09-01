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

    allowCors(...methods) {
        this.corsMethods = methods.length ? methods : ['GET', 'HEAD', 'PUT']
        return this
    }

    forWebsite() {
        this._forWebsite = true
        this._statements.push({
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"]
        })
        return this
    }

    requestResource() {
        return this.aws.headBucket({Bucket: this.name}).promise()
    }

    createResource() {
        return this.aws.createBucket({Bucket: this.name}).promise()
    }

    postCreateResource() {
        return this._configurePolicy()
            .then(this._configureCors.bind(this))
            .then(this._configureBucketAsWebsite.bind(this))
    }

    destroyResource() {
        return this.aws.deleteBucket({Bucket: this.name}).promise()
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

    _configurePolicy() {
        if (!this._statements.length) {
            return Promise.resolve()
        }
        const policy = {
            "Version": "2012-10-17",
            "Statement": this._statements
        }

        return this.aws.putBucketPolicy({
            Bucket: this.name,
            Policy: JSON.stringify(policy)
        }).promise()
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

    _configureBucketAsWebsite() {
        if (!this._forWebsite) {
            return Promise.resolve()
        }

        return this.aws.putBucketWebsite({
            Bucket: this.name,
            WebsiteConfiguration: {
                IndexDocument: {
                    Suffix: 'index.html'
                }
            }
        }).promise()
    }


}

