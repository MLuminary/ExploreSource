import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader' // eslint-disable-line
import { Provider } from 'mobx-react'
import { BrowserRouter } from 'react-router-dom'

import App from './App/app'
import appState from './store/app-state'

const root = document.getElementById('root')
const render = (Component) => {
  // Warning: Expected server HTML to contain a matching <div> in <div>
  const renderMethod = !module.hot ? ReactDOM.hydrate : ReactDOM.render
  renderMethod(
    <AppContainer>
      <Provider appState={appState}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root,
  )
}

// 将 React 转为 dom 并挂载
if (typeof window !== 'undefined') {
  render(App)
}

// 关于热加载
if (module.hot) {
  module.hot.accept('./App/app.jsx', () => {
    const NextApp = require('./App/app.jsx').default // eslint-disable-line
    render(NextApp)
  })
}
