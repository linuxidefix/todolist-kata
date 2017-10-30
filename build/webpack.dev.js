var path = require('path')
var webpackConfig = require('./webpack.base')
var webpack = require('webpack')
var OpenBrowserPlugin = require('open-browser-webpack-plugin')
var config = require('./config')

webpackConfig.devtool = 'source-map'

webpackConfig.entry.app.unshift('../build/dev-client.js')

webpackConfig.plugins = webpackConfig.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new OpenBrowserPlugin({ url: 'http://localhost:' + config.port }),
])

module.exports = webpackConfig
