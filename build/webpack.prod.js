var path = require('path')
var config = require('./webpack.base')
var webpack = require('webpack')

config.output.path = path.resolve(__dirname, '../prod/dist')

var env = process.argv[2] && process.argv[2] === 'maintenance' ? 'maintenance' : 'production'

config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify(env)
        },
        '__DEVTOOLS__': false
    }),
    new webpack.optimize.UglifyJsPlugin({
        comments: false,
        mangle: false,
    })
])

module.exports = config
