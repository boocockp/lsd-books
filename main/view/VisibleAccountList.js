const { connect } = require('react-redux')
const AccountList = require('./AccountList')

const mapStateToProps = (state) => {
    return {
        accounts: state.accountsByName
    }
}

const mapDispatchToProps = () => ({})

const VisibleAccountList = connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountList)

module.exports = VisibleAccountList