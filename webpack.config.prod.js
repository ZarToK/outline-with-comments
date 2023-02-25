/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const commonWebpackConfig = require("./webpack.config");
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');

productionWebpackConfig = Object.assign(commonWebpackConfig, {
  output: {
    path: path.join(__dirname, 'build/app'),
    filename: '[name].[hash].js',
    publicPath: `${process.env.CDN_URL || ""}/static/`,
  },
  cache: true,
  mode: "production",
  devtool: 'source-map',
  entry: ['./app/index'],
  stats: "normal",
  optimization: {
    ...commonWebpackConfig.optimization,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: undefined,
          parse: {},
          compress: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: true,
          safari10: false,
        },
      }),
    ],
  },
});

productionWebpackConfig.plugins = [
  ...productionWebpackConfig.plugins,
  new WebpackManifestPlugin()
];

module.exports = productionWebpackConfig;
