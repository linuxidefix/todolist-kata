require('shelljs/global')

var webpack = require('webpack')
var ora = require('ora')
var spinner = ora('Loading...')
var conf = require('./webpack.prod.js')

spinner.start()
rm('-rf', 'prod')
mkdir('-p', 'prod/fonts', 'prod/img', 'prod/resources', 'prod/favicon')
cp('-rf', ['sources/index.html'], 'prod')
cp('-rf', ['sources/.htaccess'], 'prod')
cp('-rf', ['sources/img'], 'prod')
cp('-rf', ['sources/resources'], 'prod')
cp('-rf', ['sources/favicon'], 'prod')
cp('-rf', ['./node_modules/font-awesome/fonts'], 'prod')
cp('-rf', ['./node_modules/font-awesome/fonts'], 'prod')
if (test('-e', 'deploy.php')) {
    cp('-f', ['deploy.php'], 'prod')
};
webpack(conf, function(err, stats) {
    spinner.stop()
    if (err) {
        throw err
    }

    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n')
})
