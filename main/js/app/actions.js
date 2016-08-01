const uuid = require('node-uuid')

function action(type, args) {
    return Object.assign( {type: type.name}, args);
    
}

function addAccount(data) {
    const dataWithId = data.id ? data : Object.assign({id: uuid.v4()}, data)
    return action(addAccount, {data: dataWithId});
}

function updateAccount(data) {
    return action(updateAccount, {data});
}

function addTransaction(transaction) {
    return action(addTransaction, {transaction})
}

module.exports = {addAccount, updateAccount, addTransaction};