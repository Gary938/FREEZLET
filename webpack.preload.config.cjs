const path = require('path');

module.exports = {
  mode: 'production',
  target: 'electron-preload',
  entry: './Preload/preload.mjs',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'preload.bundle.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
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
      '@Progress': path.resolve(__dirname, 'Progress')
    },
    extensions: ['.js', '.mjs'],
  },
}; 