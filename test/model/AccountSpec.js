let chai = require('chai'),
    Account = require('../../main/model/Account'),
    {EXPENSE} = require('../../main/model/Types').AccountType;

chai.should();

describe("Account", function() {
    describe("object", function() {
        let a;

        beforeEach(function () {
            a = new Account({name: "Travel", code: "1111", type: EXPENSE});
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
            const a2 = a.merge({name: "Fred"});
            a.name.should.eql("Travel");
            a.type.should.eql(EXPENSE);
            a2.name.should.eql("Fred");
            a2.type.should.eql(EXPENSE);
        });

    });
    
});
