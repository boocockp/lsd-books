function action(type, args) {
    return Object.assign( {type}, args);
    
}

function addAccount(data) {
    return action(addAccount, {data});
}

function updateAccount(id, data) {
    return action(updateAccount, {id, data});
}

function addTransaction(transaction) {
    return action(addTransaction, {transaction})
}

module.exports = {addAccount, updateAccount, addTransaction};