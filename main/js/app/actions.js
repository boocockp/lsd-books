function action(type, args) {
    return Object.assign( {type: type.name}, args);
}

function setAccount(account) {
    return action(setAccount, {data: account});
}

function addAccount(data) {
    return action(addAccount, {data});
}

function updateAccount(data) {
    return action(updateAccount, {data});
}

function setTransaction(transaction) {
    return action(setTransaction, {data: transaction});
}

function addTransaction(data) {
    return action(addTransaction, {data})
}

function updateTransaction(data) {
    return action(updateTransaction, {data})
}

module.exports = {setAccount, addAccount, updateAccount, setTransaction, addTransaction, updateTransaction};