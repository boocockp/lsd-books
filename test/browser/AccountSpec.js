describe("LSD Books", function () {
    this.timeout(5000);
    const dataSet = "test"

    let appFrame, appWindow, appDoc, $app, appStore
    let books, a, b, c, d

    function account(name, code, type) {
        const action = addAccountAction({name, code, type})
        appWindow.applyAction(action)
        return action.data
    }

    function button(text) {
        const el = $app.find(`button:contains('${text}')`)
        if (el.length === 0) {
            return null
        }
        return el
    }

    function heading2() {
        return $app.find(`h2`)
    }

    function field(name) {
        return new FormItem($app.find(`label:contains('${name}')`).closest('.form-group'))
    }

    function dataStore() {
        return appStore_.state.value
    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    function addAccountAction(acctData) {
        return {
            id: guid(),
            type: "setAccount",
            data: {
                "@type": "AccountData",
                id: guid(),
                name: acctData.name,
                code: acctData.code,
                type: {"@type": "AccountType", name: acctData.type}
            }
        }
    }

    function clearData(dataSet) {
        localStorage.removeItem(`lsdbooks.${dataSet}.actions`)
        localStorage.removeItem(`lsdbooks.${dataSet}.updates`)
    }

    function navigate(...pathElements) {
        const ideaSecurityCode = location.search.substr(1).split(/&/).find(it => it.match(/^_ijt=/))
        const appUrl = `${location.origin}/lsdbooks/build/index.html?dataSet=${dataSet}&${ideaSecurityCode}#`
        const fullUrl = appUrl + "/" + pathElements.join("/")
        return new Promise(function (resolve, reject) {
            if (appFrame.src.startsWith(appUrl)) {
                appFrame.src = fullUrl
                console.log('changed location to', fullUrl)
                resolve()
            } else {
                const onLoad = function () {
                    appFrame.removeEventListener('load', onLoad)
                    console.log('loaded', fullUrl)
                    resolve()
                }
                appFrame.addEventListener('load', onLoad)
                console.log('navigating to', fullUrl)
                appFrame.src = fullUrl
            }
        })
    }

    function waitFor(condition) {
        const startTime = Date.now()
        const timeout = 10000
        return new Promise(function(resolve, reject) {
            function testCondition() {
                const result = condition()
                if (result) {
                    resolve(result)
                } else if (Date.now() - startTime > timeout) {
                    reject( new Error("Timeout waiting for " + condition.toString()))
                } else {
                    setTimeout(testCondition, 100)
                }
            }

            testCondition()
        })
    }

    before(function () {
        window.appFrame = appFrame = document.getElementById("appFrame")

        clearData(dataSet)
        return navigate().then(function () {
            console.log('iframe loaded')
            window.appWindow = appWindow = appFrame.contentWindow
            window.appDoc = appDoc = appWindow.document
            window.$app = $app = $(appDoc)
            window.appStore_ = appStore = appWindow.appStore_
            return true
        })
    })

    describe("Accounts", function () {

        it("creates new account and shows details", function () {
            navigate("account")
            return waitFor(() => button("New")).then(function (newButton) {
                newButton.click()
                field("Name").value = "Fruit"
                field("Code").value = "4203"
                field("Type").value = "EXPENSE"
                button("Save").click()

                return waitFor( () => heading2().text() === "4203 - Fruit").then( () => {
                    button("4203 - Fruit").hasClass("active").should.be.true
                    field("Name").value.should.eql("Fruit")
                    field("Code").value.should.eql("4203")
                    field("Type").value.should.eql("EXPENSE")
                    const expectedPath = "account/" + dataStore().accountByCode("4203").id
                    appWindow.location.href.should.include(expectedPath)
                    return true
                })

            })
        })

        it("shows a new account when added and can navigate to it", function () {
            navigate("account")
            const acct = account("Biscuits", 4303, "REVENUE")
            button("4303 - Biscuits").click()

            heading2().text().should.eql("4303 - Biscuits")
            button("4303 - Biscuits").hasClass("active").should.be.true
            field("Name").value.should.eql("Biscuits")
            field("Code").value.should.eql("4303")
            field("Type").value.should.eql("REVENUE")
        });
    })

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

