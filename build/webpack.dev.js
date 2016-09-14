var path = require('path')
var config = require('./webpack.base')
var webpack = require('webpack')

config.devtool = 'source-map'

config.entry.app.unshift('../build/dev-client.js')

config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
])

module.exports = config
