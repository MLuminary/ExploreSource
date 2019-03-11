const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const serverRender = require('./util/server-render')
const favicon = require('serve-favicon')

const app = express()
// 创建 application/json 解析
app.use(bodyParser.json())
// 创建 application/x-www-form-urlencoded 解析
app.use(bodyParser.urlencoded({extended: false}))

app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false, // 是否每次都重新保存会话，建议false
  saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
  secret: 'react cnode class' // 用来对session id相关的cookie进行签名
}))

app.use(favicon(path.join(__dirname, 'favicon.ico')))

app.use('/api/user', require('./util/handle-login'))
app.use('/api', require('./util/proxy'))

const isDev = process.env.NODE_ENV === 'development'
// 生产环境
if( !isDev ) {
  const serverEntry = require('../dist/server-entry') // require 默认不会解析 export default
  // 使用 utf8 编码模式获取到模板文件
  const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf8')
  // 需要指明静态文件的目录，要不然所有的文件都会返回服务端渲染的文件
  app.use('/public', express.static(path.join(__dirname, '../dist')))

  app.get('*', function(req, res){
    serverRender(serverEntry, template, req, res)
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}

// 调用 catch 会在这里 参数不能少， express 通过判断参数个数来启用 catch 处理
app.use(function(error, req, res, next) {
  console.log(error)
  res.status(500).send(error)
})

app.listen(3333, function() {
  console.log('listen 3333')
})
