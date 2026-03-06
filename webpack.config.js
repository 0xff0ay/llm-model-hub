/**
 * Webpack configuration
 */

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  mode: 'production',
  output: {
    filename: 'index.js',
    path: __dirname + '/dist'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
};
