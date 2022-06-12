/*
 * @Author: victorsun
 * @Date: 2022-05-04 20:13:37
 * @LastEditors: victorsun
 * @LastEditTime: 2022-06-09 03:19:43
 * @Descripttion: 
 */
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    clean: true,
  },
  mode: 'development',
  devServer: {
    port: 4096,
    hot: true,
    // https
    // disableHostCheck: true,
    allowedHosts: [
      '*',
      'localhost',
      'local.csxiaoyao.test',
    ],
    https: {
      key: fs.readFileSync('./local.csxiaoyao.test-key.pem'),
      cert: fs.readFileSync('./local.csxiaoyao.test.pem'),
    },
  },
  resolve: {},
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public', to: 'public' },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
};