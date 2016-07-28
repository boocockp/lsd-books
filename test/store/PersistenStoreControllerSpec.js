const chai = require('chai')
chaiSubset = require('chai-subset')
const PersistentStoreController = require('../../main/js/store/PersistentStoreController')

chai.should()
chai.use(chaiSubset);


function testAction(name) {
    return {type: 'TEST', data: {name}}
}

function testActionWithId(name, id = uuid.v4()) {
    return {id, type: 'TEST', data: {name}}
}

describe("Persistent store controller", function () {
    this.timeout(100)

    const [testAction1, testAction2, testAction3] = ["One", "Two", "Three"].map(testAction)

    let controller

    beforeEach("set up app", function () {
        controller = new PersistentStoreController()
    })


    it("stores action from app", function () {
        controller.actionFromApp(testAction1)
        controller.actionToStore().should.containSubset(testAction1)
        controller.actionToStore().id.should.not.be.null
    })

    it("sends update to remote store when local stored actions with store already available", function () {
        controller.remoteStoreAvailable(true)
        controller.localStoredActions([testAction1, testAction2])
        controller.updateToStoreRemote().actions.should.containSubset([testAction1, testAction2])
    })
})
