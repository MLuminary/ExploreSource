const fs = require('fs')
const path = require('path')
const express = require('express')
const ReactSSR = require('react-dom/server')
const serverEntry = require('../dist/server-entry').default // require 默认不会解析 export default
// 使用 utf8 编码模式获取到模板文件
const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')
const app = express()

// 需要指明静态文件的目录，要不然所有的文件都会返回服务端渲染的文件
app.use('/public', express.static(path.join(__dirname, '../dist')))

app.get('*', function(req, res){
  const _appString = ReactSSR.renderToString(serverEntry)
  const appString = template.replace('<app></app>', _appString)
  res.send(appString)
})

app.listen(3333, function() {
  console.log('listen 3333')
})