require('shelljs/global')

var config = require('./config')
var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var webpackConfig = require('./webpack.dev')
var chokidar = require('chokidar')
var compiler = webpack(webpackConfig)
var hotMiddleWare = require('webpack-hot-middleware')

cp('-rf', ['./node_modules/font-awesome/fonts'], 'sources')

/*chokidar.watch('./sources/*.html').on('all', function (path) {
    console.log('File ' + path + ' has changed')
    hotMiddleWare.publish({ action: 'reload' })
})*/

var server = new WebpackDevServer(compiler, {
    hot: true,
    contentBase: './sources',
    historyApiFallback: true,
    quiet: false,
    noInfo: false,
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true }
})

server.use(hotMiddleWare(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
}))

server.listen(config.port, function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log('Listening ' + config.port + ' port')
    }
})
