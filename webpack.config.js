var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: mode === 'development' ? 'eval' : 'source-map',
  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html.ejs')
    }),
  ],
  resolve: {
    alias: {
      'quill$': path.resolve(__dirname, 'node_modules/quill/quill.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
    ],
  },
};
