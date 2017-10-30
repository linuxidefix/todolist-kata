var webpackConfig = require('./webpack.base')

module.exports = () => {
    webpackConfig.devtool = 'inline-source-map'
    webpackConfig.module.rules.shift()

    return webpackConfig
}
