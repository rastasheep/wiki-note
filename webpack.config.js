const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  entry: {
    'chrome/index': path.resolve(__dirname, 'app/chrome/index.js'),
    'chrome/background': path.resolve(__dirname, 'app/chrome/background.js'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  devtool: mode === 'development' ? 'eval' : 'source-map',
  devServer: {
    contentBase: './build/chrome',
    proxy: [
      {
        context: ['**', '!/favicon.ico'],
        target: 'http://localhost:8080/chrome',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      chunks: ['chrome/index'],
      filename: 'chrome/index.html',
      template: path.join(__dirname, 'app/chrome/index.html.ejs'),
    }),
    new CopyWebpackPlugin([
      {
        from: 'app/chrome/manifest.json',
        to: 'chrome/',
        transform: function(content, path) {
          return Buffer.from(
            JSON.stringify({
              description: process.env.npm_package_description,
              version: process.env.npm_package_version,
              ...JSON.parse(content.toString()),
            }),
          );
        },
      },
      {
        from: 'assets/icon*.png',
        to: 'chrome/[name].[ext]',
      },
    ]),
  ],
  resolve: {
    alias: {
      quill$: path.resolve(__dirname, 'node_modules/quill/quill.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['css-loader'],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
    ],
  },
};
