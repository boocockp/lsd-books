class GoogleSigninTracker {
    constructor() {
        this.signInListeners = new Listeners()
        this.signOutListeners = new Listeners()
        document.addEventListener('googleSignIn', e =>  this.signInListeners.notify( e.detail.authResponse ))
        document.addEventListener('googleSignOut', e => this.signOutListeners.notify())
    }

    onSignIn(listener) {
        this.signInListeners.add(listener)
    }

    onSignOut(listener) {
        this.signOutListeners.add(listener)
    }
}

class Listeners {
    constructor() {
        this.listeners = []
    }

    add(listener) {
        this.listeners.push(listener)
    }

    notify(data) {
        this.listeners.map( l => l(data) )
    }
}

module.exports = GoogleSigninTracker