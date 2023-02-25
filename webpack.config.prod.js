/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');

commonWebpackConfig = require('./webpack.config');

productionWebpackConfig = Object.assign(commonWebpackConfig, {
  cache: true,
  mode: "production",
  devtool: 'source-map',
  entry: ['./app/index'],
  stats: "normal",
  optimization: {
    usedExports: true,
  },
});

productionWebpackConfig.plugins = [
  ...productionWebpackConfig.plugins,
  new WebpackManifestPlugin()
];

module.exports = productionWebpackConfig;
