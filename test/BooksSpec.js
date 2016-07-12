let chai = require('chai'),
    _ = require('lodash'),
    Books = require('../main/Books'),
    Account = require('../main/Account'),
    // Transaction = require('../../main/model/Transaction'),
    // Posting = require('../../main/model/Posting'),
    // Memoize = require('../../shared/modules/memoize/Memoize'),
    // Observe = require('../../shared/modules/observe/Observe'),
    // JsonUtil = require('../../shared/modules/json/JsonUtil'),
    {DEBIT, CREDIT} = require('../main/Types').DebitCredit,
    {FIXED_ASSET, CURRENT_ASSET, LONG_TERM_LIABILITY, CURRENT_LIABILITY, CAPITAL, EXPENSE, REVENUE} = require('../main/Types').AccountType;

chai.should();

function trackChanges(valueFn) {
    if (typeof valueFn != 'function') {
        throw new Error('trackChanges must be given a function');
    }
    const theChanges = [];
    Observe.onChange(() => theChanges.push(valueFn()));

    return {
        get latest() {
            return theChanges.slice(-1)[0]
        },
        get count() {
            return theChanges.length
        },
        get all() {
            return theChanges
        }
    }
}

function credit(...acctsAmounts) {
    const type = CREDIT;
    const acctAmountPairs = _.chunk(acctsAmounts, 2);
    return acctAmountPairs.map( ([acct, amount]) => new Posting(acct.code, type, amount));
}

function debit(...acctsAmounts) {
    const type = DEBIT;
    const acctAmountPairs = _.chunk(acctsAmounts, 2);
    return acctAmountPairs.map( ([acct, amount]) => new Posting(acct.code, type, amount));
}


describe("Books", function () {
    this.timeout(100);
    let date1 = new Date("2010-10-01");
    let date2 = new Date("2010-10-02");
    let date3 = new Date("2010-10-03");
    let books, a, b, c, d;

    function transaction(date, debits, credits) {
        books.addTransaction(new Transaction(date, "Transaction " + (transaction.seqNo++), debits.concat(credits)));
    }
    transaction.seqNo = 0;

    function dcTransaction(date, amount, debitAccount, creditAccount) {
        transaction(date, debit(debitAccount, amount), credit(creditAccount, amount))
    }

    function account(name, code, type) {
        const id = account.nextId++;

        const data = {id, name, code, type};
        books = books.addAccount(data);
        return data;
    }
    account.nextId = 1000;

    beforeEach("set up app", function () {
        // Observe.TEST_clearListeners();
        books = Books.TEST_newInstance;
        a = account("Travel", "3333", EXPENSE);
        b = account("Food", "2222", REVENUE);
        c = account("Heat", "1111", EXPENSE);
        d = account("Light", "4444", EXPENSE);
    });

    describe("Books object", function () {
        it("gets account by id now", function () {
            books.account(a.id).toJS().should.eql(a);
        });

        it("knows accounts by name now", function () {
            books.accountsByName.toJS().should.eql([b, c, d, a]);
        });

        it("gets accounts by type sorted by code now", function () {
            books.accountsOfType(EXPENSE).toJS().should.eql([c, a, d]);
        });

        it("gets account by code now", function () {
            books.accountByCode("2222").toJS().should.eql(b);
        });
    });

    describe.skip("books object with changing data", function () {
        it("re-sorts accounts when names change", function () {
            const accountListChanges = trackChanges(() => books.accountsByName);
            books.updateAccount(b.code, {name: "Water"});
            accountListChanges.latest.should.eql([c, d, a, b]);
        });
    });

    describe.skip("Books object with transactions", function () {
        it("knows account balances and debit and credit balances", function () {
            dcTransaction(date1, 100, a, b);
            transaction(date2, debit(a, 200, c, 50), credit(b, 200, d, 50));

            books.accountsByName.map(it => it.signedBalance).should.eql([300, -50, 50, -300]);
            books.accountsByName.map(it => it.debitBalance).should.eql([null, 50, null, 300]);
            books.accountsByName.map(it => it.creditBalance).should.eql([300, null, 50, null]);
        });

        it("notifies updates to individual account balance", function () {

            const changesA = trackChanges(() => books.accountByCode(a.code).signedBalance);
            const changesB = trackChanges(() => books.accountByCode(b.code).signedBalance);

            books.addTransaction(new Transaction(date1, "Day out", [
                new Posting(a.code, DEBIT, 100),
                new Posting(b.code, CREDIT, 100)
            ]));

            changesA.latest.should.eql(-100);
            changesB.latest.should.eql(100);

            books.addTransaction(new Transaction(date2, "Conference trip", [
                new Posting(a.code, DEBIT, 200),
                new Posting(b.code, CREDIT, 200),
                new Posting(c.code, DEBIT, 50),
                new Posting(d.code, CREDIT, 50)
            ]));

            changesA.latest.should.eql(-300);
            changesB.latest.should.eql(300);
        });

        it("notifies updates to individual account names", function () {

            const changesA = trackChanges(() => books.accountByCode(a.code).name);
            const changesB = trackChanges(() => books.accountByCode(b.code).name);

            books.updateAccount(a.code, {name: "Travel Expenses"});
            books.updateAccount(b.code, {name: "Entertainment"});

            changesA.latest.should.eql("Travel Expenses");
            changesB.latest.should.eql("Entertainment");

            books.updateAccount(b.code, {name: "Customer Ents"});
            changesA.latest.should.eql("Travel Expenses");
            changesB.latest.should.eql("Customer Ents");
        });

        it("notifies updates to any of the account balances", function () {

            const changes = trackChanges(() => books.accountsByName.map(it => it.signedBalance));

            books.addTransaction(new Transaction(date1, "Day out", [
                new Posting(a.code, DEBIT, 100),
                new Posting(b.code, CREDIT, 100)
            ]));

            changes.all.should.eql([[0, 0, 0, 0], [100, 0, 0, -100]]);

            books.addTransaction(new Transaction(date2, "Conference trip", [
                new Posting(a.code, DEBIT, 200),
                new Posting(b.code, CREDIT, 200),
                new Posting(c.code, DEBIT, 50),
                new Posting(d.code, CREDIT, 50)
            ]));

            changes.all.should.eql([[0, 0, 0, 0], [100, 0, 0, -100], [300, -50, 50, -300]]);

            // changes.latest.should.eql([300, -50, 50, -300]);
            // changes.count.should.eql(3); // inc initial zero bals

        });

        it("returns same functional objects for each call", function () {
            const nameA = books.accountByCode(a.code).name;
            const nameA2 = books.accountByCode(a.code).name;
            nameA.should.equal(nameA2);

        });
    });

    describe.skip("Json", function () {
        it("can be serialized to JSON and deserialized", function () {
            dcTransaction(date1, 100, a, b);
            transaction(date2, debit(a, 200, c, 50), credit(b, 200, d, 50));

            const json = JsonUtil.toStore(books);
            // console.log("json", json);
            const newBooks = JsonUtil.fromStore(json);
            // console.log("newBooks", newBooks);

            newBooks.accountsByName.map(it => it.signedBalance).should.eql([300, -50, 50, -300]);
            newBooks.accountsByName.map(it => it.debitBalance).should.eql([null, 50, null, 300]);
            newBooks.accountsByName.map(it => it.creditBalance).should.eql([300, null, 50, null]);
        });

    });

    describe.skip("trial balance", function () {

        it("has accounts with non-zero balances and debit totals", function () {
            const tb = books.trialBalance;

            transaction(date1, debit(a, 100), credit(b, 100));

            tb.accounts.should.eql([b, a]);
            tb.debitTotal.should.eql(100);
            tb.creditTotal.should.eql(100);

            transaction(date2, debit(a, 200, c, 50), credit(b, 200, d, 50));

            tb.accounts.should.eql([c, b, a, d]);
            tb.debitTotal.should.eql(350);
            tb.creditTotal.should.eql(350);

        });
    });

    describe.skip("balance sheet", function () {
        it("has amounts in correct categories sorted by code", function () {
            const
                faFurniture = account("Furniture", "5557", FIXED_ASSET),
                faMachines = account("Machines", "5554", FIXED_ASSET),
                capital = account("Capital", "4000", CAPITAL);

            const bs = books.balanceSheet(date2);
            dcTransaction(date1, 100, faMachines, capital);
            dcTransaction(date1, 75, faFurniture, capital);
            dcTransaction(date2, 150, faFurniture, capital);

            bs.fixedAssets.accounts.map( it => [it.name, it.balance]).should.eql( [["Machines", 100], ["Furniture", 225]]);
            bs.fixedAssets.total.should.eql(325);

            bs.capitalReserves.accounts.map( it => [it.name, it.balance]).should.eql( [["Capital", 325]]);
            bs.capitalReserves.total.should.eql(325);

        });

        it("has balances as at given date", function () {
            const fa1 = account("Machines", "5555", FIXED_ASSET);
            const fa2 = account("Furniture", "5556", FIXED_ASSET);
            const cap = account("Capital", "4000", CAPITAL);

            const bs1 = books.balanceSheet(date1);
            const bs2 = books.balanceSheet(date2);

            transaction(date1, debit(fa1, 100), credit(cap, 100));

            bs1.fixedAssets.total.should.eql(100);
            bs1.capitalReserves.total.should.eql(100);

            bs2.fixedAssets.total.should.eql(100);
            bs2.capitalReserves.total.should.eql(100);

            transaction(date2, debit(fa2, 200), credit(cap, 200));
            bs1.fixedAssets.total.should.eql(100);
            bs1.capitalReserves.total.should.eql(100);

            bs2.fixedAssets.total.should.eql(300);
            bs2.capitalReserves.total.should.eql(300);

        });
    });


});
