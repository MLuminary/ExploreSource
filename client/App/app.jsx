import * as React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'

import Routes from '../config/router'
import ButtonAppBar from '../views/layout/app-bar'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
  }

  render() {
    return [
      <div key="app">
        <ButtonAppBar />
      </div>,
      <Routes key="routes" />,
      <CssBaseline />
    ]
  }
}
