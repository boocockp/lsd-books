let AwsResource = require('./AwsResource')

module.exports = class ObjectInS3 extends AwsResource {

    constructor(s3, bucket, key, content, contentType, extraParams) {
        super(s3, key)
        Object.assign(this, {bucket, key, content, contentType, extraParams})
    }

    get name() {
        return this.key
    }

    get arn() {
        return `${this.bucket.arn}/${this.key}`
    }

    requestResource() {
        return this.aws.headObject({Bucket: this.bucket.name, Key: this.key}).promise()
    }

    createResource() {
        return this.aws.createObject({Bucket: this.bucket.name, Key: this.key, Body: this.content}).promise()
    }

    destroyResource() {
        return this.aws.deleteObject({Bucket: this.name, Key: this.key}).promise()
    }

    get resourceNotFoundCode() {
        return 'NotFound'
    }

    updateFromResource(data) {
        // nothing to do
    }

    get logDescription() {
        return `Object ${this.bucket.name}/${this.key}`
    }

}

