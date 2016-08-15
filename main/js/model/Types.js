const _ = require('lodash'),
    {JsonUtil} = require('lsd-storage');

function enumValues(clazz, ...enumArgs) {
    const vals = []
    for(const n of enumArgs) {
        const instanceArgs = [].concat(n)
        const instance = new clazz(...instanceArgs);
        clazz[instanceArgs[0]] = instance
        vals.push(instance)
    }

    clazz.values = function() {
        return vals.slice()
    }

    clazz.valueMap = function() {
        return _.fromPairs(vals.map( v => [v.name, v]))
    }
}

class DebitCredit {

    constructor(name) {
        this.name = name;
    }

    get label() {
        return _.startCase(this.name.toLowerCase())
    }

    toString() {
        return this.name;
    }
    toJSON() {
        return {"@type": this.constructor.name, name: this.name};
    }

}
enumValues(DebitCredit, 'DEBIT', 'CREDIT');

const {DEBIT, CREDIT} = DebitCredit;
JsonUtil.registerClass(DebitCredit);


class AccountType {
    constructor(name, normalBalanceType) {
        this.name = name;
        this.normalBalanceType = normalBalanceType;
    }

    get label() {
        return _.startCase(this.name.toLowerCase())
    }

    toString() {
        return this.name;
    }

    get isAsset() { return this === AccountType.FIXED_ASSET || this === AccountType.CURRENT_ASSET}
    get isLiability() { return this === AccountType.LONG_TERM_LIABILITY || this === AccountType.CURRENT_LIABILITY}

    toJSON() {
        return {"@type": this.constructor.name, name: this.name};
    }


}

enumValues(AccountType,
    ['FIXED_ASSET', DEBIT],
    ['CURRENT_ASSET', DEBIT],
    ['LONG_TERM_LIABILITY', CREDIT],
    ['CURRENT_LIABILITY', CREDIT],
    ['CAPITAL', CREDIT],
    ['EXPENSE', DEBIT],
    ['REVENUE', CREDIT]);

JsonUtil.registerClass(AccountType);


module.exports = {DebitCredit, AccountType};