const React = require('react')
const {Navbar, Nav, NavItem, NavDropdown, MenuItem} = require('react-bootstrap')
const {GoogleSignin} = require('lsd-views')
const Account = require('../model/Account')
const Transaction = require('../model/Transaction')

const NavBar = ({googleClientId}, {getNavigationManager}) => {

    const accountNav = getNavigationManager(Account)
    const transactionNav = getNavigationManager(Transaction)
    const generalNav = getNavigationManager()

    const goAccounts = (e) => {
        e.preventDefault()
        accountNav.navigate()
    }

    const goTransactions = (e) => {
        e.preventDefault()
        transactionNav.navigate()
    }

    const goTrialBalance = (e) => {
        e.preventDefault()
        generalNav.navigate("/reports/trialBalance")
    }

    const goBalanceSheet = (e) => {
        e.preventDefault()
        generalNav.navigate("/reports/balanceSheet")
    }
    return (
        <Navbar inverse>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href="#">LSD Books</a>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav>
                    <NavItem eventKey={1} href={accountNav.mainPath} onClick={goAccounts}>Accounts</NavItem>
                    <NavItem eventKey={2} href={transactionNav.mainPath} onClick={goTransactions}>Transactions</NavItem>
                    <NavDropdown eventKey={3} title="Reports" id="reports-dropdown">
                        <MenuItem eventKey={3.1} href="/reports/trialBalance"
                                  onClick={goTrialBalance}>Trial Balance</MenuItem>
                        <MenuItem eventKey={3.2} href="/reports/balanceSheet"
                                  onClick={goBalanceSheet}>Balance Sheet</MenuItem>
                    </NavDropdown>
                </Nav>
                <Navbar.Form pullRight>
                    <GoogleSignin clientId={googleClientId}/>
                </Navbar.Form>
                <Nav pullRight>
                    <NavItem eventKey={4} href="test.html" target="_blank">Test</NavItem>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

NavBar.contextTypes = {getNavigationManager: React.PropTypes.func}

module.exports = NavBar