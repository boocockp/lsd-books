import chai from 'chai'
import Account from '../../main/js/model/Account'
import AccountData from '../../main/js/model/AccountData'
import {AccountType} from '../../main/js/model/Types'
const {EXPENSE} = AccountType

chai.should();

describe("Account", function() {
    describe("object", function() {
        let a, data;

        beforeEach(function () {
            data = new AccountData({name: "Travel", code: "1111", type: EXPENSE});
            a = new Account(data);
        });

        it("knows details now", function() {
            a.name.should.eql("Travel");
            a.type.should.eql(EXPENSE);
        });

        it("has read-only properties", function () {
            (function() {
                a.name = "Fred";
            }).should.throw(Error);
        });

        it("can get a new updated copy", function () {
            const a2 = data.merge({name: "Fred"});
            data.name.should.eql("Travel");
            data.type.should.eql(EXPENSE);
            a2.name.should.eql("Fred");
            a2.type.should.eql(EXPENSE);
        });

    });
    
});
