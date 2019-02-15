const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: path.join(__dirname, '../client/app.jsx')
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, '../dist'),   // 输出文件的位置
    publicPath: '' // 静态资源路径
  },
  module: {
    rules: [{
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
      test: /\.js$/,          // 对 jsx 后缀文件打包时，先用 babel-loader 转换一下
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader'
        }
      ],
    }]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}