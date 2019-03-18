import * as React from 'react'
import * as ReactDOM from 'react-dom'
import JssProvider from 'react-jss/lib/JssProvider'
import { AppContainer } from 'react-hot-loader' // eslint-disable-line
import { Provider } from 'mobx-react'
import { BrowserRouter } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme, createGenerateClassName } from '@material-ui/core/styles'
import { lightGreen, lime } from '@material-ui/core/colors'

import App from './App/app'
import AppState from './store/app-state'

const theme = createMuiTheme({
  palette: {
    primary: lightGreen,
    secondary: lime,
    type: 'light'
  },
  typography: {
    useNextVariants: true,
  },
})

const createApp = (NextApp) => {
  class Main extends React.Component {
    // Remove the server-side injected CSS.
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return <NextApp />
    }
  }

  return Main
}

// create a new class name generator
const generateClassName = createGenerateClassName()

// 获取到服务端传递过来的数据
const initialState = window.__INITIAL__STATE__ || {} // eslint-disable-line

const root = document.getElementById('root')
const render = (Component) => {
  // Warning: Expected server HTML to contain a matching <div> in <div>
  const renderMethod = !module.hot ? ReactDOM.hydrate : ReactDOM.render
  renderMethod(
    <AppContainer>
      <Provider appState={new AppState(initialState.appState)}>
        <BrowserRouter>
          <JssProvider generateClassName={generateClassName}>
            <MuiThemeProvider theme={theme}>
              <Component />
            </MuiThemeProvider>
          </JssProvider>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root,
  )
}

// 将 React 转为 dom 并挂载
if (typeof window !== 'undefined') {
  render(createApp(App))
}

// 关于热加载
if (module.hot) {
  module.hot.accept('./App/app.jsx', () => {
    const NextApp = require('./App/app.jsx').default // eslint-disable-line
    render(createApp(NextApp))
  })
}
