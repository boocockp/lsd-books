const _ = require('lodash'),
    {Record} = require('immutable'),
    JsonUtil = require('../../../shared/modules/json/JsonUtil'),
    // Books = require('./Books'),
    {CREDIT} = require('./Types').DebitCredit,
    {AccountType} = require('./Types')

class Account extends Record({id: null, name: null, code: null, type: null}) {

    static get entityDescriptor() {
        const descriptors = {
            name: {
                type: String,
                placeholder: "The descriptive name"
            },
            code: {
                type: Number,
                maxLength: 4,
                placeholder: "The account short code",
                help: "Must be 4 digits"
            },
            type: {
                type: AccountType,
                placeholder: "The type of account"
            }
        }
        return {
            name: "Account",
            propertyNames: ["name", "code", "type"],
            propertyDescriptor: function(name) {
                return Object.assign({name, label: _.startCase(name)}, descriptors[name])
            }
        }
    }

    constructor(data = {}) {
        super(data)
    }

    get description() {
        return `${this.code} - ${this.name}`
    }

    get signedBalance() {
        // const signedAmount = (p) => p.type == CREDIT ? p.amount : -p.amount
        // const sum = (acc, val) => acc + val
        // return Books.instance.postingsForAccount(this).map(signedAmount).reduce(sum, 0)
        return 0
    }

    get balance() {
        const sign = this.type.normalBalanceType == CREDIT ? 1 : -1
        return this.signedBalance * sign
    }

    get debitBalance() {
        return this.signedBalance < 0 ? Math.abs(this.signedBalance) : null
    }

    get creditBalance() {
        return this.signedBalance > 0 ? this.signedBalance : null
    }

    toJSON() {
        return Object.assign(super.toJSON(), {"@type": this.constructor.name})
    }

}

JsonUtil.registerClass(Account)
module.exports = Account