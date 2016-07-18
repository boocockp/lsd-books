const React = require('react')
const PersistentRouter = require('./PersistentRouter')
const VisibleAccountList = require('./VisibleAccountList')
const MainPage = require('./MainPage')
const NotFoundPage = require('./NotFoundPage')
const {Locations, Location, NotFound} = require('react-router-component')

const App = () => (
    <div>
        <h1>Books</h1>
        <PersistentRouter hash>
            <Location path="/" handler={MainPage}/>
            <Location path="/account" handler={VisibleAccountList}/>
            <Location path="/account/:routedId" handler={VisibleAccountList}/>
            <NotFound handler={NotFoundPage} />
        </PersistentRouter>
    </div>)

module.exports = App