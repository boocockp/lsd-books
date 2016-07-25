const React = require('react')
const {Provider} = require('react-redux')

const App = require('./App')

const AppProvider = ({store}) => (
    <Provider store={store}>
        <App />
    </Provider>
)

module.exports = AppProvider