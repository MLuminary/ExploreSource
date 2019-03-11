import * as React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'

import App from './App/app'
import { createStoreMap } from './store/store'

// 让 mobx 再服务端渲染时不会重复数据变换
useStaticRendering(true)

// 每次 store 可能不同
export default (stores, routerContext, url) => (
  <Provider {...stores}>
    <StaticRouter context={routerContext} location={url}>
      <App />
    </StaticRouter>
  </Provider>
)

export { createStoreMap }
