const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const ReactSSR = require('react-dom/server')
const favicon = require('serve-favicon')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'react cnode class'
}))

app.use(favicon(path.join(__dirname, 'favicon.ico')))

app.use('/api/user', require('./util/handle-login'))
app.use('/api', require('./util/proxy'))

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
