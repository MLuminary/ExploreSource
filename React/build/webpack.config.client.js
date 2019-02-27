const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
// webpack 适用于不同的环境
const isDev = process.env.NODE_ENV === 'development'

const config = {
  resolve: {extensions: ['.js','.jsx']},
  entry: {
    app: path.join(__dirname, '../client/index.jsx')
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, '../dist'),   // 输出文件的位置
    publicPath: '/public/' // 静态资源路径,需要与服务端渲染区分开
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.(js|jsx)$/,
      loader: 'eslint-loader',
      exclude: [
        path.resolve(__dirname, '../node_modules')
      ]
    },
    {
      test: /\.jsx$/,          // 对 jsx 后缀文件打包时，先用 babel-loader 转换一下
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['react']
          }
        }
      ],
    },
    {
      test: /\.js$/,          // 对 js 后缀文件打包时，先用 babel-loader 转换一下
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader'
        }
      ],
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../client/template.html')
    })
  ]
}

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
    }
  }

  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}


module.exports = config