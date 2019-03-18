import * as React from 'react'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';

import Routes from '../config/router'

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
        <Link to="/">首页</Link>
        <br />
        <Link to="/detail">详情</Link>
        <Button variant="contained" color="primary">
          你好，世界
        </Button>
      </div>,
      <Routes key="routes" />
    ]
  }
}
