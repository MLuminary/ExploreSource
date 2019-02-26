const axios = require('axios')
const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const ReactDOMServer = require('react-dom/server')
const proxy = require('http-proxy-middleware')

const serverConfig = require('../../build/webpack.config.server')
// 要启动 npm run dev:client 然后获取 template 页面
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

const Module = module.constructor

const mfs = new MemoryFs() // 让 fs 去内存中拿文件
const serverCompiler = webpack(serverConfig)
// 将原本的 fs 读取改为 mfs
serverCompiler.outputFileSystem = mfs
let serverBundle
// 监听文件重新去打包
serverCompiler.watch({}, (err, stats) => {
  if(err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warn => console.warn(warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  // 去内存中去拿文件
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = new Module()
  // 将 bundle 编译成 node 中的 module
  m._compile(bundle, 'server-entry.js')
  // 导出来的模板文件
  serverBundle = m.exports.default
})

module.exports = function(app) {
  // /public 开头代理到 http:/localhost:8888
  app.use('/public/', proxy({
    target: 'http://localhost:8888'
  }))

  app.get('*', function(req, res) {
    getTemplate().then(template => {
      const content = ReactDOMServer.renderToString(serverBundle)
      res.send(template.replace('<!-- app -->', content))
    })
  })
}