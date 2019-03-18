const path = require('path')
const baseConfig = require('./webpack.config.base')
const webpackMerge = require('webpack-merge')

module.exports = webpackMerge(baseConfig, {
  target: 'node', // 在 node 环境中执行
  entry: {
    app: path.join(__dirname, '../client/server-entry.jsx')
  },
  externals: Object.keys(require('../package').dependencies),
  output: {
    filename: 'server-entry.js',
    libraryTarget: 'commonjs2' // 使用最新的 commonjs 的加载方案
  }
})
