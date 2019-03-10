const axios = require('axios')
const path = require('path')
const ejs = require('ejs')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const ReactDOMServer = require('react-dom/server')
const proxy = require('http-proxy-middleware')
const serialize = require('serialize-javascript')
const bootstrapper = require('react-async-bootstrapper')
const { Helmet } = require('react-helmet')

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

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
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
  serverBundle = m.exports.default
  createStoreMap = m.exports.createStoreMap
})

module.exports = function(app) {
  // /public 开头代理到 http:/localhost:8888
  app.use('/public/', proxy({
    target: 'http://localhost:8888'
  }))

  app.get('*', function(req, res) {
    getTemplate().then(template => {

      const routerContext = {}
      const stores = createStoreMap()
      // 根据 url 返回不同的内容
      const app = serverBundle(stores, routerContext, req.url)
      // 异步，此时可以拿到 routerContext
      bootstrapper(app).then(() => {
        // 有这个属性的话在服务端直接重定向, renderToSring 后会拿到 routerContext
        if(routerContext.url) {
          res.status(302).setHeader('Location', routerContext.url)
          res.end()
          return
        }
        // 当前客户端 state
        const state = getStoreState(stores)
        const content = ReactDOMServer.renderToString(app)
        const helmet = Helmet.renderStatic() // 拿到在客户端用 helmet 定义的头部信息

        const html = ejs.render(template, {
          appString: content,
          initialState: serialize(state),
          meta: helmet.meta.toString(),
          title: helmet.title.toString(),
          style: helmet.style.toString(),
          link: helmet.link.toString()
        })
        res.send(html)
        // res.send(template.replace('<!-- app -->', content))
      })
    })
  })
}
