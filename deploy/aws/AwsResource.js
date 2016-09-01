let {logError} = require('./Util')

module.exports = class AwsResource {
    constructor(resourceFactory, nameInEnv) {
        Object.assign(this, {resourceFactory, nameInEnv})
    }

    get aws() {
        return this.resourceFactory.awsService
    }

    get environment() {
        return this.resourceFactory.environment
    }

    get name() {
        return this.environment.name + "_" + this.nameInEnv
    }

    create() {
        let updateFromGetResponse = (data) => {
            this.updateFromResource(data)
            this.existed = true
            return this
        }

        let updateFromCreateResponse = (data) => {
            this.updateFromResource(data)
            this.created = true
            return this
        }

        let updateFromUpdateResponse = (data) => {
            this.updated = true
            return this
        }

        let logAndThrow = (err) => {
            logError(err, 'create', this.logDescription)
            throw err
        }

        let doPostCreate = () => {
            return this.postCreateResource().then(() => Promise.resolve(this))
        }

        let doCreate = () => {
            return this.createResource().then(updateFromCreateResponse).then(doPostCreate).catch(logAndThrow)
        }

        let doUpdate = () => {
            if (typeof this.updateResource === 'function') {
                return this.updateResource().then(updateFromUpdateResponse).catch(logAndThrow)
            }
            return Promise.resolve(this)
        }

        let getResourceIfExists = () => {
            return this.requestResource().then(updateFromGetResponse).catch(this.checkError.bind(this))
        }

        let getOrCreate = () => {
            return getResourceIfExists().then(resource => resource.existed ? doUpdate() : doCreate()).catch(logError)
        }

        return this._createPromise || (this._createPromise = getOrCreate() )
    }

    destroy() {
        let updateFromGetResponse = (data) => {
            this.updateFromResource(data)
            this.existed = true
            return this
        }

        let logAndThrow = (err) => {
            logError(err, 'destroy', this.logDescription)
            throw err
        }

        let doDestroy = () => {
            return this.destroyResource().then(() => {
                    this.destroyed = true
                    return this
                }
            ).catch(logAndThrow)
        }

        let doNotFound = () => {
            this.notFound = true
            return Promise.resolve(this)
        }

        let getResourceIfExists = () => {
            return this.requestResource().then(updateFromGetResponse).catch(this.checkError.bind(this))
        }

        let destroyIfExists = () => {
            return getResourceIfExists().then(resource => resource.existed ? doDestroy() : doNotFound()).catch(logError)

        }
        return this._destroyPromise || (this._destroyPromise = destroyIfExists() )
    }

    checkError(err) {
        if (err.code == this.resourceNotFoundCode) {
            return this
        }

        throw err
    }

    get resultDescription() {
        let state = this.updated ? 'updated'
            : this.destroyed ? 'destroyed'
            : this.existed ? 'found'
            : this.created ? 'created'
            : this.notFound ? 'not found'
            : 'ERROR'
        return `${this.logDescription} - ${state}`
    }

    requestResource() {
        throw new Error('Subclass must implement')
    }

    createResource() {
        throw new Error('Subclass must implement')
    }

    destroyResource() {
        throw new Error('Subclass must implement')
    }

    get resourceNotFoundCode() {
        throw new Error('Subclass must implement')
    }

    get arn() {
        throw new Error('Subclass must implement')
    }

    get logDescription() {
        return `${this.constructor.name} ${this.name}`
    }

    updateFromResource(data) {
        throw new Error('Subclass must implement')
    }

    postCreateResource() {
        return Promise.resolve(this)
    }

}
