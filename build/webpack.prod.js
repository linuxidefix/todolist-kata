var path = require('path')
var config = require('./webpack.base')
var webpack = require('webpack')

config.output.path = path.resolve(__dirname, '../prod/dist')

config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        },
        '__DEVTOOLS__': false
    }),
    new webpack.optimize.UglifyJsPlugin({
        comments: false
    })
])

module.exports = config
