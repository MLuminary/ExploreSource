const ejs = require('ejs')
const { Helmet } = require('react-helmet')
const serialize = require('serialize-javascript')
const bootstrapper = require('react-async-bootstrapper')
const ReactDOMServer = require('react-dom/server')

// material ui
const SheetsRegistry = require('jss').SheetsRegistry
const createMuiTheme = require('@material-ui/core/styles').createMuiTheme
const createGenerateClassName = require('@material-ui/core/styles').createGenerateClassName
const colors = require('@material-ui/core').colors

// 调用 toJson 解析当前 stores
const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
}

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const routerContext = {}
    const createStoreMap = bundle.createStoreMap
    const createApp = bundle.default
    const stores = createStoreMap()
    // 创建 material ui 相关
    const sheetsRegistry = new SheetsRegistry()
    const sheetsManager = new Map()
    const theme = createMuiTheme({
      palette: {
        primary: colors.lightGreen,
        secondary: colors.lime,
        type: 'light'
      },
      typography: {
        useNextVariants: true,
      },
    })
    const generateClassName = createGenerateClassName()

    // 根据 url 返回不同的内容
    const app = createApp(
      stores,
      routerContext,
      req.url,
      sheetsRegistry,
      generateClassName,
      theme,
      sheetsManager
    )
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
        initialState: serialize(state), // 向客户端传递数据，客户端不需要再拉取 api
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        materialStyle: sheetsRegistry.toString()
      })
      res.send(html)
      resolve()
      // res.send(template.replace('<!-- app -->', content))
    }).catch(reject)
  })
}
