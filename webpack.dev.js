const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',  // inject CSS langsung ke DOM (pake tag <style>)
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    // Copy manifest dan ikon saja, tidak copy sw.js karena bundling dgn InjectManifest di production
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/public/manifest.json', to: 'manifest.json' },
        { from: 'src/public/icons', to: 'icons' },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 9002,
    compress: true,
    historyApiFallback: true, // untuk SPA routing
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    setupMiddlewares: (middlewares, devServer) => {
      // Set Content-Type agar manifest dikenali oleh browser
      devServer.app.get('/manifest.json', (req, res, next) => {
        res.setHeader('Content-Type', 'application/manifest+json');
        next();
      });
      return middlewares;
    },
  },
  devtool: 'eval-source-map',
});
