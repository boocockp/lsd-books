require('aws-sdk/dist/aws-sdk')
const AWS = window.AWS


module.exports = class S3UpdateStore {

    constructor(bucketName, keyPrefix, appId, authTracker, identityPoolId) {
        Object.assign(this, {bucketName, keyPrefix, appId, identityPoolId})
        authTracker.signIn.sendTo( this.googleLogin.bind(this) )
    }

    storeActions(actions) {
        const timestamp = Date.now()
        const updateContent = JSON.stringify( {timestamp, actions})
        const prefix = this.keyPrefix ? this.keyPrefix + '/' : ''
        const ensureUnique = Math.floor(Math.random() * 100000)
        const key = prefix + this.appId + '/' + timestamp + '-' + ensureUnique
        this._storeInS3(key, updateContent)
    }

    getUpdates() {
        const {s3, bucketName} = this
        if (!s3) return Promise.resolve([])

        function getUpdateKeys() {
            return s3.listObjectsV2({ Bucket: bucketName }).promise().then( listData => listData.Contents.map( x => x.Key ))
        }

        function getObjectBody(key) {
            return s3.getObjectBody({Key: key}).promise().then( data => data.Body )
        }

        function getObjectsForKeys(keys) {
            const promises = keys.map( getObjectBody )
            return Promise.all(promises)
        }

        function asUpdates(objectBodies) {
            return objectBodies.map( b => JSON.parse(b) )
        }

        return getUpdateKeys().then( getObjectsForKeys ).then( asUpdates ).catch( e => {console.error('Error getting updates', e); return []} )
    }

    _storeInS3(key, objectContent) {
        const params = {
            Bucket: this.bucketName,
            Key: key,
            Body: objectContent
        }

        this.s3.putObject(params).promise().catch( e => console.error(e) )
    }

    googleLogin(authResponse) {
        AWS.config.region = 'eu-west-1'
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: this.identityPoolId,
            Logins: {
                'accounts.google.com': authResponse.id_token
            }
        });


        this.s3 = new AWS.S3()

        console.log('Logged in.');
    }

}