let AWS = require('aws-sdk');
let Bucket = require('./Bucket');

module.exports = class S3 {
    constructor(env) {
        this.environment = env;
        this.s3 = this.awsService = new AWS.S3();
    }

    static get awsServiceName() { return "s3.amazonaws.com"; }


    static get listBucket() { return "s3:ListBucket" }
    static get getObject() { return "s3:GetObject" }
    static get putObject() { return "s3:PutObject" }

    bucket(name) {
        return this.environment.add(new Bucket(this, name));
    }
}

;

