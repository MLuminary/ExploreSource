const path = require('path')

module.exports = {
  resolve: { extensions: ['.js','.jsx'] },
  output: {
    path: path.join(__dirname, '../dist'),   // 输出文件的位置
    publicPath: '/public/' // 静态资源路径,需要与服务端渲染区分开
  },
  module: {
    rules: [
      {
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
      },
      {
        test: /\.ejs$/,
        loader: 'compile-ejs-loader'
      }
    ]
  }
}
