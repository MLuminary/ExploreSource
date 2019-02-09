const path = require('path')

module.exports = {
  entry: {
    app: path.join(__dirname, '../client/app.js')
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, '../dist'),   // 输出文件的位置
    publicPath: '/public'      // 静态资源路径
  }
}