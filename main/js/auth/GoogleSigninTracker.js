const ObservableData = require('lsd-events').ObservableData

class GoogleSigninTracker {
    constructor() {
        this.signIn = new ObservableData()
        this.signOut = new ObservableData()
        document.addEventListener('googleSignIn', e =>  this.signIn.value = e.detail.authResponse )
        document.addEventListener('googleSignOut', e => this.signOut.value = null)
    }
}

module.exports = GoogleSigninTracker