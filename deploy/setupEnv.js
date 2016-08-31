var AWS = require('aws-sdk'),
    promisify = require("promisify-node"),
    fs = promisify('fs'),
    mime = require('mime');

const Environment = require('./aws/Environment');
const SES = require('./aws/SES');
const S3 = require('./aws/S3');
const IAM = require('./aws/IAM');
const Lambda = require('./aws/Lambda');
const Policy = require('./aws/Policy');
const Role = require('./aws/Role');
const {arnFromResource}  = require('./aws/Util');

AWS.config.loadFromPath('./awsConfig.json');
var awsConfig = JSON.parse(fs.readFileSync('./awsConfig.json', "utf8"));
var appConfig = JSON.parse(fs.readFileSync('./appConfig.json', "utf8"));

const args = process.argv.slice(2);
const envName = args[0];
if (!envName) {
    let scriptName = process.argv[1].split('/').pop();
    console.error(`Usage: node ${scriptName} <env>`);
    return;
}

const environment = new Environment("lsdbooks", envName, awsConfig.accountId);
const s3 = new S3(environment);
const iam = new IAM(environment);
const lambda = new Lambda(environment);
const ses = new SES(environment);

let dataBucket = s3.bucket("data").allowCors().allowCognitoFolderAccess(`updates/${appConfig.appName}/${envName}`);

environment.create();


// let emailBucket = s3.bucket("emaildata");
// const emailFolder = emailBucket.objectsPrefixed(bucketPrefix);
// emailBucket.allowServiceFromThisAccount(SES.awsServiceName, emailBucket.allObjects, S3.putObject);
// let receiveEmailPolicy = iam.policy("receiveEmail")
//     .allow(emailFolder, S3.getObject)
//     .allow(dataBucket.allObjects, S3.getObject, S3.putObject);
// let receiveEmailRole = iam.role("receiveEmail").trust(Lambda).withPolicies(iam.basicExecution, receiveEmailPolicy);
// let receiveEmail = lambda.lambdaFunction("receiveEmail", "../lambda/receiveEmail/build/build.zip").withRole(receiveEmailRole).canBeInvokedBy(SES);
// let receiptRuleSet = ses.receiptRuleSet('receiveEmail');
// let receiveEmailRule = ses.receiptRule(receiptRuleSet, 'processEmail')
//     .withS3Action(emailBucket, bucketPrefix)
//     .withLambdaAction(receiveEmail);

