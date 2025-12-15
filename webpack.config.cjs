const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    preload: './Preload/preload.mjs',
    renderer: './Renderer/rendererEntry.js'
  },
  target: 'electron-renderer',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/, // поддержка .js и .mjs
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
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
    extensions: ['.js', '.mjs'],
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
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
      global: 'global'
    }),
    new webpack.DefinePlugin({
      global: 'globalThis'
    })
  ]
};
