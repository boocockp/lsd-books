const React = require('react')

const TransactionListItem = require('./TransactionListItem')

class ViewUtils {

    displayViewFactory(modelType) {
        return function(item, onClick) {
            return React.createElement(TransactionListItem, {item, onClick})
        }
    }

    editViewFactory(modelType) {

    }

    registerView(modelType, viewType) {

    }
}

module.exports = ViewUtils