const {sum, prop} = require('./FunctionHelpers')
const {Record, List, Map} = require('immutable')

module.exports = class TrialBalance extends Record({allAccounts: List()}) {
    
    constructor(allAccounts) {
        super({allAccounts})
    }
    
    get accounts() {
        return this.allAccounts.filter(it => it.signedBalance !== 0 ).sortBy(prop('code'));
    }

    get totals() {
        return {
            debit: this.accounts.map(it => it.debitBalance).reduce(sum),
            credit: this.accounts.map(it => it.creditBalance).reduce(sum)
        }
    }
};