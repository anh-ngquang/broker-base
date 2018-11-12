//webpack.config.js
var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'development',
 entry: './client/index.js',
 output: {
  path: path.join(__dirname, 'client'),
  filename: 'bundle.js'
 },
 module: {
    rules: [
        {
          test: /.jsx?$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
            test: /\.css$/,
            loader: "style-loader!css-loader"
          }
      ]
 }
}