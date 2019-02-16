const path = require('path')

module.exports = {
  target: 'node',
  entry: {
    app: path.join(__dirname, '../client/server-entry.jsx')
  },
  output: {
    filename: 'server-entry.js',
    path: path.join(__dirname, '../dist'),   // 输出文件的位置
    publicPath: '/public', // 静态资源路径
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