import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App/app'
import { AppContainer } from 'react-hot-loader' // eslint-disable-line

const root = document.getElementById('root')
const render = (Component) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Component />
    </AppContainer>,
    root,
  )
}

// 将 React 转为 dom 并挂载
if (typeof window !== 'undefined') {
  render(App)
}

if (module.hot) {
  module.hot.accept('./App/app.jsx', () => {
    const NextApp = require('./App/app.jsx').default // eslint-disable-line
    render(NextApp)
  })
}
