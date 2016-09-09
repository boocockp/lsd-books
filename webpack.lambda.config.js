var webpack = require("webpack")
var path = require('path')

var dir_js = path.resolve(__dirname, 'lambda');
var dir_build = path.resolve(__dirname, 'build_lambda');

module.exports = {
    entry: {
        promoter: path.resolve(dir_js, 'promoter/index.js'),
    },
    output: {
        path: path.resolve(dir_build, 'promoter'),
        filename: 'index.js',
        libraryTarget: 'commonjs2'
    },
    target: "node",
    externals: {
        "aws-sdk": true
    },
    module: {
        noParse: [
            /aws\-sdk/,
        ],
        loaders: [
            {
                loader: 'babel-loader?cacheDirectory',
                test: [/\.js$/],
                exclude: [
                    path.resolve(__dirname, "node_modules"),
                ]
            }
        ]
    },
    plugins: [
    ],
};