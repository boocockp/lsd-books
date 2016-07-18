const React = require('react')
const PersistentRouter = require('./PersistentRouter')
const VisibleAccountList = require('./VisibleAccountList')
const MainPage = require('./MainPage')
const {Locations, Location} = require('react-router-component')

const App = () => (
    <div>
        <h1>Books</h1>
        <PersistentRouter hash>
            <Location path="/" handler={MainPage}/>
            <Location path="/account" handler={VisibleAccountList}/>
        </PersistentRouter>
    </div>)

module.exports = App