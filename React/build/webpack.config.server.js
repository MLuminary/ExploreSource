const path = require('path')

module.exports = {
  mode: 'development',
  target: 'node', // 在 node 环境中执行
  entry: {
    app: path.join(__dirname, '../client/server-entry.jsx')
  },
  output: {
    filename: 'server-entry.js',
    path: path.join(__dirname, '../dist'),   // 输出文件的位置
    publicPath: '', // 静态资源路径,需要与服务端渲染区分开
    libraryTarget: 'commonjs2' // 使用最新的 commonjs 的加载方案
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
      test: /\.js$/,          // 对 js 后缀文件打包时，先用 babel-loader 转换一下
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader'
        }
      ],
    }]
  }
}