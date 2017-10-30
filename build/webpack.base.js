var path = require('path')
var root = path.resolve(__dirname, '../')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    context: path.join(__dirname, '../sources'),
    resolve: {
        extensions: ['.ts', '.js']
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
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                exclude: /(node_modules|bower_components|libraries|typings)/,
                options: {
                    configFile: path.resolve(root, './tslint.json')
                }
            },
            {
                test: /sass\/.+\.scss|sass\\.+\.scss$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
            },
            {
                test: /\.component\.scss$/,
                use: [
                    'raw-loader',
                    'sass-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: () => [ autoprefixer({browsers: ['last 2 versions']}) ],
                        },
                    },
                ],
            },
            {
                test: /\.(css|html)$/,
                loader: 'raw-loader'
            },
            {
                test: /\.ts$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: path.resolve(root, './tsconfig.json'),
                    useCache: true,
                },
            },
            {
                test: '/\.(png|jpg|gif)$/',
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: '../img/[name]-[hash:7].[ext]'
                        }
                    }
                ],
            },
            { test: /\.svg(\?.*$|$)/, loader: 'url-loader?limit=65000&mimetype=image/svg+xml&name=../fonts/[name].[ext]' },
            { test: /\.woff(\?.*$|$)/, loader: 'url-loader?limit=65000&mimetype=application/font-woff&name=../fonts/[name].[ext]' },
            { test: /\.woff2(\?.*$|$)/, loader: 'url-loader?limit=65000&mimetype=application/font-woff2&name=../fonts/[name].[ext]' },
            { test: /\.[ot]tf(\?.*$|$)/, loader: 'url-loader?limit=65000&mimetype=application/octet-stream&name=../fonts/[name].[ext]' },
            { test: /\.eot(\?.*$|$)/, loader: 'url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=../fonts/[name].[ext]' }
        ]
    },
    plugins: [
        new ExtractTextPlugin('screen.css'),
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.join(__dirname, '../sources'), // location of your src
            { }
        )
    ],
}
