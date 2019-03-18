import * as React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'
import { JssProvider } from 'react-jss'
import { MuiThemeProvider } from '@material-ui/core/styles'

import App from './App/app'
import { createStoreMap } from './store/store'

// 让 mobx 再服务端渲染时不会重复数据变换
useStaticRendering(true)

// 每次 store 可能不同
export default (
  stores,
  routerContext,
  url,
  sheetsRegistry,
  generateClassName,
  theme,
  sheetsManager
) => (
  <Provider {...stores}>
    <StaticRouter context={routerContext} location={url}>
      <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
          <App />
        </MuiThemeProvider>
      </JssProvider>
    </StaticRouter>
  </Provider>
)

export { createStoreMap }
