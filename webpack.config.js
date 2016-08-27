var CopyWebpackPlugin = require('copy-webpack-plugin')
var webpack = require("webpack")
var path = require('path')

var dir_js = path.resolve(__dirname, 'main/js');
var dir_css = path.resolve(__dirname, 'main/css');
var dir_html = path.resolve(__dirname, 'main/html');
var dir_test = path.resolve(__dirname, 'test/browser');
var dir_build = path.resolve(__dirname, 'build');

const dependencies = require('./package.json').dependencies;
const vendorDependencies = Object.keys(dependencies).filter( d => !d.startsWith("lsd-") ).filter( d => d !== "bootstrap")
console.log('vendorDependencies', vendorDependencies.join(','))

module.exports = {
    entry: {
        appMain: path.resolve(dir_js, 'app/appMain.js'),
        vendor: vendorDependencies,
        // vendor: ['react', 'moment', 'lodash', 'react-bootstrap'],
    },
    output: {
        path: dir_build,
        filename: '[name].js'
    },
    externals: {
        "aws-sdk": "AWS"
    },
    module: {
        noParse: [
            /aws\-sdk/,
        ],
        loaders: [
            {
                loader: 'babel-loader?cacheDirectory',
                test: [dir_js, /\.js$/],
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
            { from: 'node_modules/bootstrap/dist/fonts', to: 'fonts'  },
            { from: dir_test }
        ]),
        new webpack.PrefetchPlugin('./node_modules/react-bootstrap/lib/PageItem.js'),
        new webpack.optimize.CommonsChunkPlugin({ names: ['vendor', 'manifest']}),
    ],
    // Create Sourcemaps for the bundle
    // devtool: 'source-map',
    devServer: {
        contentBase: dir_build,
    },
};