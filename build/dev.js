require('shelljs/global')

var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.dev')
var port = 8080
var chokidar = require('chokidar')
var compiler = webpack(config)
var hotMiddleWare = require('webpack-hot-middleware')(compiler)

cp('-rf', ['./node_modules/font-awesome/fonts'], 'sources')

chokidar.watch('./sources/*.html').on('all', function (path) {
    console.log('File ' + path + ' has changed')
    hotMiddleWare.publish({action: 'reload'})
})

var server = new WebpackDevServer(compiler, {
    hot: true,
    contentBase: './sources',
    historyApiFallback: true,
    outputPath: './sources',
    quiet: false,
    noInfo: false,
    publicPath: config.output.publicPath,
    stats: { colors: true }
})

server.use(hotMiddleWare)

server.listen(port, function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log('Listening ' + port + ' port')
    }
})
