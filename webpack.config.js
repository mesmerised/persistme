/* global __dirname, require, module */

const webpack = require('webpack');
const path = require('path');
const pkg = require('./package.json');
const args = require('yargs').argv;

const isProduction = args.mode === 'production';

const libraryName = pkg.name;
const ext = isProduction ? '.min.js' : '.js';
const outputFile = libraryName + ext;

const config = {
    entry: path.join(__dirname, '/src/index.js'),
    devtool: 'source-map',
    optimization: {
        minimize: isProduction,
    },
    output: {
        path: path.join(__dirname, '/lib'),
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /(\.jsx|\.js)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        modules: [path.resolve('./node_modules'), path.resolve('./src')],
        extensions: ['.json', '.js'],
    },
    plugins: [
        new webpack.BannerPlugin('Copyright (c) Emad Alam http://emad.in\nhttps://github.com/mesmerised/persistme'),
    ],
};

module.exports = config;
