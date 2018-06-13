const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');

// static files
const copyPatterns = [
    { from: "./src/media", to: "./media" },
    { from: "./src/data", to: "./data" }
]

const extractSass = new ExtractTextPlugin({
    filename: "styles.css",
    disable: process.env.NODE_ENV !== 'prod'
});

module.exports = {
    entry: {
        mustload: './src/js/mustload.js',
        d3: './src/js/d3.js',
        app: './src/js/app.js'
    },
    devServer: {
        contentBase: './dist',
        hot: true
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            favicon: './src/media/god-cloud.png',
            hash: true
        }),
        extractSass,
        new CopyWebpackPlugin(copyPatterns),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [{
            test: /\.scss$/,
            use: process.env.NODE_ENV !== 'prod' ? [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: { url: false }
            }, {
                loader: 'sass-loader'
            }] : ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                        loader: 'css-loader',
                        options: {
                            // See https://github.com/webpack-contrib/css-loader#url
                            url: false,
                            minimize: true,
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false
                        }
                    }
                ]
            })
        }, {
            test: /\.js$/,
            loader: 'babel-loader?presets[]=es2015'
        }, {
            test: /\.csv$/,
            loader: 'csv-loader',
            options: {
                dynamicTyping: true,
                header: true,
                skipEmptyLines: true
            }
        }]
    }
}