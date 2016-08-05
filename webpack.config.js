var CopyWebpackPlugin = require('copy-webpack-plugin')
var path = require('path')

var dir_js = path.resolve(__dirname, 'main/js');
var dir_css = path.resolve(__dirname, 'main/css');
var dir_html = path.resolve(__dirname, 'main/html');
var dir_build = path.resolve(__dirname, 'build');

module.exports = {
    entry: path.resolve(dir_js, 'app/appMain.js'),
    output: {
        path: dir_build,
        filename: 'appMain.bundle.js'
    },
    module: {
        noParse: [
            /aws\-sdk/,
        ],
        loaders: [
            {
                loader: 'babel-loader',
                test: dir_js,
                include: [
                    dir_js,
                ],
                exclude: [
                    path.resolve(__dirname, "node_modules"),
                ]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: dir_html }, // to: output.path
            { from: dir_css }, // to: output.path
            { from: 'node_modules/bootstrap/dist/css/bootstrap.css' }, // to: output.path
            { from: 'node_modules/bootstrap/dist/css/bootstrap-theme.css' }, // to: output.path
            { from: 'node_modules/bootstrap/dist/fonts', to: 'fonts'  }
        ]),
    ],
    // Create Sourcemaps for the bundle
    // devtool: 'source-map',
    devServer: {
        contentBase: dir_build,
    },
};