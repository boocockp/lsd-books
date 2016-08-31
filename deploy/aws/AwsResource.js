let {logError} = require('./Util');

module.exports = class AwsResource {
    constructor(resourceFactory, nameInEnv) {
        Object.assign(this, {resourceFactory, nameInEnv});
    }

    get aws() {
        return this.resourceFactory.awsService;
    }

    get environment() {
        return this.resourceFactory.environment;
    }

    get name() {
        return this.environment.name + "_" + this.nameInEnv;
    }

    create() {
        let updateFromGetResponse = (data) => {
            this.updateFromResource(data);
            this.existed = true;
            return this;
        };

        let updateFromCreateResponse = (data) => {
            this.updateFromResource(data);
            this.created = true;
            return this;
        };

        let updateFromUpdateResponse = (data) => {
            this.updated = true;
            return this;
        };

        let logAndThrow = (err) => {
            logError(err, 'create', this.logDescription);
            throw err;
        };

        let doPostCreate = () => {
            return this.postCreateResource();
        };

        let doCreate = () => {
            return this.createResource().then(updateFromCreateResponse).then(doPostCreate).catch(logAndThrow);
        };

        let doUpdate = () => {
            if (typeof this.updateResource === 'function' ) {
                return this.updateResource().then(updateFromUpdateResponse).catch(logAndThrow);
            }
            return Promise.resolve(this)
        };

        let getResourceIfExists = () => {
            return this.requestResource().then(updateFromGetResponse).catch(this.checkError.bind(this));
        };

        let getOrCreate = () => {
            return getResourceIfExists().then( resource => resource.existed ? doUpdate() : doCreate() ).catch(logError);
        };

        return this._createPromise || (this._createPromise = getOrCreate() );
    }

    checkError(err) {
        if (err.code == this.resourceNotFoundCode) {
            return this;
        }

        throw err;
    }

    get resultDescription() {
        let state = this.updated ? 'updated' : this.existed ? 'found' : this.created ? 'created': 'ERROR';
        return `${this.logDescription} - ${state}`;
    }

    requestResource() {
        throw new Error('Subclass must implement')
    }

    createResource() {
        throw new Error('Subclass must implement')
    }

    get resourceNotFoundCode() {
        throw new Error('Subclass must implement')
    }

    get arn() {
        throw new Error('Subclass must implement')
    }

    get logDescription() {
        throw new Error('Subclass must implement')
    }

    updateFromResource(data) {
        throw new Error('Subclass must implement')
    }

    postCreateResource() {
        return Promise.resolve(this);
    }

};
