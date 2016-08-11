

describe("Account Page", function() {
    this.timeout(5000);
    let appFrame, appWindow, appDoc, $app, appStore
    let books, a, b, c, d

    function account(name, code, type) {
        const id = account.nextId++;

        const data = {id, name, code, type};
        books = books.addAccount(data);
        return data;
    }
    account.nextId = 1000

    function button(text) {
        return $app.find(`button:contains('${text}')`)
    }

    function heading2() {
        return $app.find(`h2`)
    }

    function field(name) {
        return new FormItem($app.find(`label:contains('${name}')`).closest('.form-group'))
    }

    function dataStore() {
        return appStore_.getState()
    }

    function clearData(dataSet) {
        localStorage.removeItem(`reactbooks.${dataSet}.actions`)
        localStorage.removeItem(`reactbooks.${dataSet}.updates`)
    }

    before(function (done) {
        window.appFrame =  appFrame = document.getElementById("appFrame")

        appFrame.addEventListener('load', function () {
            console.log('iframe loaded')
            window.appWindow = appWindow = appFrame.contentWindow
            window.appDoc = appDoc = appWindow.document
            window.$app = $app = $(appDoc)
            window.appStore_ = appStore = appWindow.appStore_
            done()
        })

        const dataSet = "test"
        clearData(dataSet)
        const ideaSecurityCode = location.search.substr(1).split(/&/).find( it => it.match(/^_ijt=/))
        const appUrl = `${location.origin}/reactbooks/build/index.html?dataSet=${dataSet}&${ideaSecurityCode}#`
        appFrame.src = appUrl + "/account/1002"
    })

    it("runs a test", function() {
        (100 + 1).should.eql(101)
    })

    describe("Accounts", function() {

        it("creates new account and shows details", function () {
            button("New").click()
            field("Name").value = "Fruit"
            field("Code").value = "4203"
            field("Type").value = "EXPENSE"
            button("Save").click()

            heading2().text().should.eql("Account 4203 - Fruit")
            button("4203 - Fruit").hasClass("active").should.be.true
            field("Name").value.should.eql("Fruit")
            field("Code").value.should.eql("4203")
            field("Type").value.should.eql("EXPENSE")

            const expectedPath = "account/" + dataStore().accountByCode("4203").id
            appWindow.location.href.should.include(expectedPath)
        });
    });
    
});

class FormItem {
    constructor(el) {
        this.el = el
    }

    get input() {
        return this.el.find(':input')
    }

    get value() {
        return this.input.val()
    }

    set value(v) {
        this.input.val(v)
        const changeEventType = this.input.is('input') ? 'input' : 'change'
        const changeEvent = new Event(changeEventType, {bubbles: true})
        this.input.get(0).dispatchEvent(changeEvent)
    }
}

