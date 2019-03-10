const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.config.base')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
// webpack 适用于不同的环境
const isDev = process.env.NODE_ENV === 'development'

const config = webpackMerge(baseConfig, {
  entry: {
    app: path.join(__dirname, '../client/index.jsx')
  },
  output: {
    filename: '[name].[hash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../client/template.html')
    }),
    new HtmlWebpackPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
      filename: 'server.ejs'
    })
  ]
})

if (isDev) {
  config.mode = 'development'
  config.entry = {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../client/index.jsx')
    ]
  }
  // 在 dist 目录下启动 localhost:8888/filename 就可以访问到
  config.devServer = {
    host: '0.0.0.0',
    port: '8888',
    // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要
    contentBase: path.join(__dirname, '../dist'),
    hot: true,
    // 出现错误显示
    overlay: {
      errors: true
    },
    publicPath: '/public/',
    historyApiFallback: {
      index: '/public/index.html'
    },
    proxy: {
      '/api': 'http://localhost:3333'
    }
  }

  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}


module.exports = config
