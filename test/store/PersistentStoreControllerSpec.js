const chai = require('chai')
const PersistentStoreController = require('../../main/js/store/PersistentStoreController')
const PersistentStoreControllerObservable = require('../../main/js/store/PersistentStoreControllerObservable')
const NewActionRouter = require('../../main/js/store/NewActionRouter')
const {jsEqual, jsMatch} = require('../testutil/ChaiHelpers')


const should = chai.should()
chai.use(jsEqual);
chai.use(jsMatch);


function testAction(name) {
    return {type: 'TEST', data: {name}}
}

function testActionWithId(name, id = uuid.v4()) {
    return {id, type: 'TEST', data: {name}}
}

function update(actions) {
    return NewActionRouter.newUpdate(actions)
}

describe("Persistent store controller", function () {
    this.timeout(100)

    const [action1, action2, action3] = ["One", "Two", "Three"].map(testAction)
    const [savedAction1, savedAction2, savedAction3] = ["One", "Two", "Three"].map(testActionWithId)

    let controller

    beforeEach("set up app", function () {
        controller = new PersistentStoreControllerObservable(new PersistentStoreController())
    })

    it("no action to store if none from app", function () {
        should.not.exist(controller.actionToStore())
        controller.localStoredActions([savedAction1])
        should.not.exist(controller.actionToStore())
    })

    it("stores action from app with id", function () {
        controller.actionFromApp(action1)
        controller.actionToStore().should.containSubset(action1)
        controller.actionToStore().id.should.not.be.null
    })

    it("stores actions from app until they are in the local store", function () {
        controller.actionFromApp(action1)
        controller.actionFromApp(action2)
        controller.actionToStore().should.containSubset(action1)
        const testAction1WithId = controller.actionToStore()

        controller.localStoredActions([testAction1WithId])
        controller.actionToStore().should.containSubset(action2)
        const testAction2WithId = controller.actionToStore()

        controller.localStoredActions([testAction1WithId, testAction2WithId])
        should.not.exist(controller.actionToStore())
    })

    it("sends update to remote store when local stored actions with store already available", function () {
        controller.remoteStoreAvailable(true)
        should.not.exist(controller.updateToStoreRemote())

        controller.localStoredActions([action1, action2])
        controller.updateToStoreRemote().actions.should.jsMatch([action1, action2])
        controller.updateToStoreRemote().id.should.not.be.null
    })

    it("sends update to remote store only when store becomes available", function () {
        controller.localStoredActions([action1, action2])
        should.not.exist(controller.updateToStoreRemote())

        controller.remoteStoreAvailable(true)
        controller.updateToStoreRemote().actions.should.jsMatch([action1, action2])
    });

    it("sends no update to remote store when local stored actions removed", function () {
        controller.localStoredActions([action1, action2])
        controller.remoteStoreAvailable(true)
        controller.updateToStoreRemote().actions.should.jsMatch([action1, action2])

        controller.localStoredActions()
    });

    it("sends ids to delete and update to local store once only when update stored in remote", function () {
        controller.updateStoredRemote(update([savedAction1, savedAction2]))

        controller.actionsToDelete().should.eql([savedAction1, savedAction2])
        controller.updateToStoreLocal().actions.should.containSubset([savedAction1, savedAction2])

        controller.localStoredUpdates([update([savedAction1, savedAction2]), update([savedAction3])])
        should.not.exist(controller.actionsToDelete())
        should.not.exist(controller.updateToStoreLocal())
    });

    it("on startup sends actions from local stored updates to actions to apply", function () {
        const actionsOutput = []
        controller.actionsToApply.sendFlatTo( x => actionsOutput.push(x) )

        controller.localStoredUpdates([update([savedAction1, savedAction2]), update([savedAction3])])
        controller.actionsToApply().size.should.eql(0)
        actionsOutput.should.be.empty

        controller.init()
        controller.actionsToApply().should.jsMatch([savedAction1, savedAction2, savedAction3])
        actionsOutput.should.eql([savedAction1, savedAction2, savedAction3])
    });

})
