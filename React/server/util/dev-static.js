const axios = require('axios')
const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const proxy = require('http-proxy-middleware')
const serverRender = require('./server-render')

const serverConfig = require('../../build/webpack.config.server')
// 要启动 npm run dev:client 然后获取 template 页面
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

const NativeModule = require('module')
const vm = require('vm')

const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }

  const wrapper = NativeModule.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename,
    displayErrors: true
  })
  // 运行 js 代码
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
}

const mfs = new MemoryFs() // 让 fs 去内存中拿文件
const serverCompiler = webpack(serverConfig)
// 将原本的 fs 读取改为 mfs
serverCompiler.outputFileSystem = mfs
let serverBundle, createStoreMap
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
  // const m = new Module()
  // 将 bundle 编译成 node 中的 module
  // m._compile(bundle, 'server-entry.js') // 设置了 externals 后，包的体积减少了，但是这里无法用 require 获取到依赖
  const m = getModuleFromString(bundle, 'server-entry.js')
  // 导出来的模板文件
  serverBundle = m.exports
})

module.exports = function(app) {
  // /public 开头代理到 http:/localhost:8888
  app.use('/public/', proxy({
    target: 'http://localhost:8888'
  }))

  app.get('*', function(req, res, next) {
    if(!serverBundle) {
      return res.send('waiting for compile, refresh later')
    }
    getTemplate().then(template => {
      return serverRender(serverBundle, template, req, res)
    }).catch(next)
  })
}
