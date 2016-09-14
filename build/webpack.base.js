var path = require('path')
var root = path.resolve(__dirname, '../')
var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
    context: path.join(__dirname, '../sources'),
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    entry: {
        app: ['./main.ts']
    },
    output: {
        path: path.resolve(__dirname, '../sources/dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    module: {
        preLoaders: [
            {
                test: /\.ts$/,
                loader: 'tslint',
                exclude: /(node_modules|bower_components|libraries|typings)/
            }
        ],
        loaders: [
            {
                test: /sass\/.+\.scss|sass\\.+\.scss$/,
                loader: ExtractTextPlugin.extract(['css', 'sass'])
            },
            {
                test: /\.component\.scss$/,
                loaders: ['raw', 'sass']
            },
            {
                test: /\.(css|html)$/,
                loader: 'raw'
            },
            {
                test: /\.ts$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'ts',
                include: root
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'url?limit=65000&name=../img/[name].[ext]'
            },
            { test: /\.svg(\?.*$|$)/, loader: 'url?limit=65000&mimetype=image/svg+xml&name=../fonts/[name].[ext]' },
            { test: /\.woff(\?.*$|$)/, loader: 'url?limit=65000&mimetype=application/font-woff&name=../fonts/[name].[ext]' },
            { test: /\.woff2(\?.*$|$)/, loader: 'url?limit=65000&mimetype=application/font-woff2&name=../fonts/[name].[ext]' },
            { test: /\.[ot]tf(\?.*$|$)/, loader: 'url?limit=65000&mimetype=application/octet-stream&name=../fonts/[name].[ext]' },
            { test: /\.eot(\?.*$|$)/, loader: 'url?limit=65000&mimetype=application/vnd.ms-fontobject&name=../fonts/[name].[ext]' }
        ]
    },
    plugins: [
        new ExtractTextPlugin('screen.css')
    ],
    tslint: {
        configFile: path.resolve(root, './tslint.json')
    },
    postcss: function () {
        return [autoprefixer({browser: ['last 2 versions']})]
    }
}
