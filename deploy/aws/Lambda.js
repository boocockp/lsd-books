let AWS = require('aws-sdk');
let LambdaFunction = require('./LambdaFunction');

module.exports = class Lambda {
    constructor(env) {
        this.environment = env;
        this.lambda = this.awsService = new AWS.Lambda();
    }

    static get awsServiceName() { return "lambda.amazonaws.com"; }
    static get invoke() { return "lambda:InvokeFunction"; }

    lambdaFunction(nameInEnv, codeZipFile) {
        return this.environment.add(new LambdaFunction(this, nameInEnv, codeZipFile));
    }

};

