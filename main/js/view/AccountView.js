const _ = require('lodash')
const React = require('react')
const {PropTypes} = require('react')
const EntityView = require('./EntityView')
const EntityTable = require('./EntityTable')

let AccountView = React.createClass({

    render: function () {
        const postingsView = <EntityTable propertiesToShow={["date", "description, itemLink=transaction", "type", "amount"]}/>
        return <EntityView {...this.props} propertyViews={{postings: postingsView}}/>
    }
})

AccountView.propTypes = EntityView.propTypes

module.exports = AccountView