function action(type, args) {
    return Object.assign( {type: type.name}, args);
    
}

function addAccount(data) {
    return action(addAccount, {data});
}

function updateAccount(data) {
    return action(updateAccount, {data});
}

function addTransaction(transaction) {
    return action(addTransaction, {transaction})
}

module.exports = {addAccount, updateAccount, addTransaction};