let AWS = require('aws-sdk');
let {logError} = require('./Util');

module.exports = class Environment {

    constructor(appName, envName, accountId) {
        Object.assign(this, {appName, envName, accountId});
        this.region = AWS.config.region;
        console.log("Account Id", this.accountId, "Region", this.region);
        this.resources = [];
    }

    get name() {
        return this.appName + "_" + this.envName;
    }

    add(resource) {
        this.resources.push(resource);
        return resource;
    }

    create() {
        let logCreated = r => {
            console.log(r.resultDescription);
        };
        let createAll = () => {
            return Promise.all(this.resources.map(r => r.create().then(logCreated)));
        };

        return createAll();
    }

};

