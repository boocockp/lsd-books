var AWS = require('aws-sdk'),
    promisify = require("promisify-node"),
    fs = promisify('fs'),
    fspath = require('path'),
    mime = require('mime'),
    readdirRecursive = require('fs-readdir-recursive');

AWS.config.loadFromPath('./awsConfig.json');
var appConfig = JSON.parse(fs.readFileSync('./appConfig.json', "utf8"));

let args = process.argv.slice(2);
const env = args[0];
if (!env) {
    let scriptName = process.argv[1].split('/').pop();
    console.error(`Usage: node ${scriptName} <env>`);
    return;
}

const s3 = new AWS.S3();
const cognito = new AWS.CognitoIdentity();
const iam = new AWS.IAM();

const websiteBucket = bucketName();
getResources()
    .then( resources => {
        let resourcesExceptWebsite = resources.filter( r => r.identifier != websiteBucket).reverse();
        console.log('resources to delete\n', resourcesExceptWebsite.map( r => `${r.type}: ${r.identifier}`).join('\n'));
        return resourcesExceptWebsite
    })
    .then( resources => resources.map(deleteResource) )
    .then( deletePromises => Promise.all(deletePromises))
    .then( () => deleteResource({type: 'bucket', identifier: websiteBucket}))  // delete at end so don't lose resources file if errors
    .then( ...logResult('Delete environment', appConfig.appName, env));

function getResources() {
    let resourcesFile = "private/resources.json";
    return getFile(websiteBucket, resourcesFile).then(body => JSON.parse(body), err => {
        throw new Error(`Cannot find resources file ${resourcesFile} in bucket ${websiteBucket}: ${err.message}`)
    });
}

function deleteResource({type, identifier}) {
    switch(type) {
        case "bucket": return deleteBucket(identifier);
        case "identityPool": return deleteIdentityPool(identifier);
        case "role": return deleteRole(identifier);
        default: return unknownResource(type, identifier)
    }
}

function deleteBucket(bucketName) {
    return emptyBucket(bucketName)
        .then( () => s3.deleteBucket({Bucket: bucketName}).promise() )
        .then( ...logNotFoundOrResult('Delete bucket', bucketName))
}

function getBucketKeys(bucketName) {
    return s3.listObjects({Bucket: bucketName}).promise()
        .then( (data) => data.Contents.map( c => c.Key ) );
}

function emptyBucket(bucketName) {
    return getBucketKeys(bucketName)
        .then( keys => {
            if (keys.length) {
                let objects = keys.map(k => ({Key: k}));
                return s3.deleteObjects({Bucket: bucketName, Delete: {Objects: objects}}).promise()
            } else {
                return Promise.resolve()
            }
        });
}

function deleteIdentityPool(identityPoolId) {
    return cognito.deleteIdentityPool({IdentityPoolId: identityPoolId}).promise()
        .then( ...logNotFoundOrResult('Delete identity pool', identityPoolId))
}

function deleteRole(roleName) {
    let deleteParams = {RoleName: roleName, PolicyName: rolePolicyName(roleName)};
    return iam.deleteRolePolicy(deleteParams).promise()
        .then( () => iam.deleteRole({RoleName: roleName}).promise())
        .then( ...logNotFoundOrResult('Delete role', roleName))
}

function unknownResource(type, identifier) {
    return Promise.resolve().then(...logResult('Cannot delete resource of unknown type', type, identifier))
}

function getFile(bucketName, path) {
    return s3.getObject({ Bucket: bucketName, Key: path}).promise().then( data => data.Body.toString('utf8') );
}

function bucketName(type = "") {
    return appConfig.appName + type + '-' + env;
}

function resourceName(type = "") {
    return appConfig.appName + type + '_' + env;
}

function rolePolicyName(roleName) {
    return roleName + "_authPolicy";
}

function logResult(action, ...parameters) {
    return [() => logAction(action, ...parameters), (err) => logError(err, action, ...parameters)]
}

function logNotFoundOrResult(action, ...parameters) {
    return [() => logAction(action, ...parameters), (err) => logNotFoundOrError(err, action, ...parameters)]
}

function logAction(action, mainResource, ...otherResources) {
    console.log(action, mainResource, ...otherResources);
    return mainResource;
}

function logError(err, action, ...resourceNames) {
    console.error("FAILED", action, ...resourceNames, err);
}

function logNotFoundOrError(err, action, mainResource, ...otherResources) {
    if (err.code == 'NoSuchEntity' || err.code == 'ResourceNotFoundException' || err.code == 'NoSuchBucket') {
        console.warn(action, mainResource, 'NOT FOUND', ...otherResources)
    } else {
        console.error("FAILED", action, mainResource, ...otherResources, err);
    }

    return mainResource;
}

