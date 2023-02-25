/* eslint-disable */
const path = require('path');
const webpack = require("webpack");
const commonWebpackConfig = require("./webpack.config");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isTest = process.env.NODE_ENV === "test";

const developmentWebpackConfig = Object.assign(commonWebpackConfig, {
  output: {
    path: path.join(__dirname, 'build/app'),
    filename: '[name].[hash].js',
    publicPath: `${process.env.CDN_URL || ""}/static/`,
  },
  cache: true,
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  entry: [
    "webpack-hot-middleware/client",
    "./app/index",
  ],
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

if (!isTest) {
  developmentWebpackConfig.plugins = [
    ...developmentWebpackConfig.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin({
      overlay: {
        sockIntegration: 'whm',
      },
    }),
  ];
}

module.exports = developmentWebpackConfig;
