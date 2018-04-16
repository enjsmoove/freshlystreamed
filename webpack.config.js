const path = require('path');
const StartServerPlugin = require('start-server-webpack-plugin')

module.exports = {
  entry: [
    './main.js',
  ],
  output: {
    path: path.join(__dirname, 'www'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {presets: ["es2015", "react"]}
        }],
      },
    ],
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
    ],
  },
  plugins:[
    new StartServerPlugin('bundle.js')

  ],
  devtool: 'inline-source-map',
};
