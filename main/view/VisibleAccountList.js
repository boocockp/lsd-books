const { connect } = require('react-redux')
const AccountListWithView = require('./AccountListWithView')

const mapStateToProps = (state) => {
    return {
        accounts: state.accountsByName
    }
}

const mapDispatchToProps = () => ({})

const VisibleAccountList = connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountListWithView)

module.exports = VisibleAccountList