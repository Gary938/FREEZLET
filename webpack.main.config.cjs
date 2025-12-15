const path = require('path');

module.exports = {
  mode: 'development', // для быстрой проверки
  target: 'electron-main',
  entry: './Main/mainHub.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    // Исключаем native модули Electron из бандла
    'electron': 'commonjs electron',
    'better-sqlite3': 'commonjs better-sqlite3',
    'fs': 'commonjs fs',
    'path': 'commonjs path',
    'os': 'commonjs os',
    'crypto': 'commonjs crypto'
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
            targets: {
              node: '18' // версия Node.js в Electron
            }
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
      '@Progress': path.resolve(__dirname, 'Progress')
    },
    extensions: ['.js', '.mjs'],
  },
  plugins: [
    // Плагин только для проверки, не для использования
    function() {
      this.hooks.done.tap('CheckOnly', (stats) => {
        if (stats.hasErrors()) {
          console.log('❌ Main процесс имеет ошибки импортов!');
        } else {
          console.log('✅ Main процесс: импорты корректны');
        }
      });
    }
  ]
}; 