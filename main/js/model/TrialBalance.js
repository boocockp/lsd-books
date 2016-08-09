const {sum, prop} = require('./FunctionHelpers')
const {Record, List, Map} = require('immutable')
const Account = require('../model/Account')
const EntityDescriptor = require('../metadata/EntityDescriptor')

const descriptor = new EntityDescriptor("Trial Balance", [
    {
        name: "accounts",
        type: List,
        itemType: Account,
        description: "The accounts with a debit or credit balance"
    },
    {
        name: "totals",
        type: EntityDescriptor.forProperties({debit: Number, credit: Number}),
        description: "The totals of the debit and credit balances"
    }
])

module.exports = class TrialBalance extends Record({allAccounts: List()}) {

    static get entityDescriptor() : Object {
        return descriptor
    }

    constructor(allAccounts) {
        super({allAccounts})
    }
    
    get accounts() {
        return this.allAccounts.filter( it => it.signedBalance !== 0 ).toList().sortBy(prop('code'));
    }

    get totals() {
        return {
            debit: this.accounts.map(it => it.debitBalance).reduce(sum),
            credit: this.accounts.map(it => it.creditBalance).reduce(sum)
        }
    }
};