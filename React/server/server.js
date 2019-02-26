const fs = require('fs')
const path = require('path')
const express = require('express')
const ReactSSR = require('react-dom/server')

const app = express()

const isDev = process.env.NODE_ENV === 'development'

if( !isDev ) {
  const serverEntry = require('../dist/server-entry').default // require 默认不会解析 export default
  // 使用 utf8 编码模式获取到模板文件
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')
  // 需要指明静态文件的目录，要不然所有的文件都会返回服务端渲染的文件
  app.use('/public', express.static(path.join(__dirname, '../dist')))

  app.get('*', function(req, res){
    // 获取到需要渲染的内容 「 将 element 转为 string 」
    const _appString = ReactSSR.renderToString(serverEntry)
    const appString = template.replace('<!-- app -->', _appString)
    res.send(appString)
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}

app.listen(3333, function() {
  console.log('listen 3333')
})