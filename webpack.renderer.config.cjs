const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  mode: 'production',
  target: 'web',
  entry: './Renderer/rendererEntry.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'renderer.bundle.js',
    globalObject: 'window'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-transform-runtime', { regenerator: true }]
            ]
          }
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@UI': path.resolve(__dirname, 'UI'),
      '@Main': path.resolve(__dirname, 'Main'),
      '@Preload': path.resolve(__dirname, 'Preload'),
      '@FileManager': path.resolve(__dirname, 'FileManager'),
      '@CSS': path.resolve(__dirname, 'CSS'),
      '@Buttons': path.resolve(__dirname, 'Buttons'),
      '@Renderer': path.resolve(__dirname, 'Renderer'),
      '@Progress': path.resolve(__dirname, 'Progress'),
      '@Locales': path.resolve(__dirname, 'Locales')
    },
    extensions: ['.js', '.mjs', '.json'],
    fallback: {
      "path": require.resolve("path-browserify"),
      "fs": false,
      "os": require.resolve("os-browserify/browser"),
      "util": require.resolve("util/"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/"),
      "crypto": require.resolve("crypto-browserify")
    }
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
      global: 'globalThis'
    }),
    new webpack.DefinePlugin({
      'global': 'globalThis',
      'global.GENTLY': false
    })
  ]
}; 