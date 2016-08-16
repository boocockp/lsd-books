const Account = require('../model/Account')
const Transaction = require('../model/Transaction')
const {EntityManager} = require('lsd-storage')

class TransactionManager extends EntityManager {

    constructor(appStore) {
        super(appStore, Transaction)
    }

    choiceList() {
        return this.appStore.state.value.transactionsByDate
    }
}

class AccountManager extends EntityManager {

    constructor(appStore) {
        super(appStore, Account)
    }

    choiceList() {
        return this.appStore.state.value.accountsByName
    }

    save(entity) {
        return super.save(entity.data)
    }
}

const managerTypes = {
    [Account.name]: AccountManager,
    [Transaction.name]: TransactionManager
}

module.exports = {
    getManager: function (appStore, entityType) {
        const managerType = managerTypes[entityType.name]
        if (!managerType) {
            throw new Error("Unknown entityType " + entityType)
        }

        return new managerType(appStore)
    }
}