const uuid = require('node-uuid')

function action(type, args) {
    return Object.assign( {type: type.name}, args);
    
}

function setAccount(account) {
    const accountWithId = account.id ? account : account.merge({id: uuid.v4()})
    return action(setAccount, {data: accountWithId});
}

function addAccount(data) {
    const dataWithId = data.id ? data : Object.assign({id: uuid.v4()}, data)
    return action(addAccount, {data: dataWithId});
}

function updateAccount(data) {
    return action(updateAccount, {data});
}

function addTransaction(data) {
    return action(addTransaction, {data})
}

function updateTransaction(data) {
    return action(updateTransaction, {data})
}

module.exports = {setAccount, addAccount, updateAccount, addTransaction, updateTransaction};