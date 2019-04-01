import * as React from 'react'
import * as PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Helmet from 'react-helmet'
import { Tabs, Tab } from '@material-ui/core'

import Container from '../layout/container'
import AppState from '../../store/app-state'

@inject('appState') @observer
export class TopicList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabIndex: 0
    }
  }


  componentDidMount() {
    // do
  }

  changeTab = (e, index) => {
    this.setState({ tabIndex: index })
  }

  // 服务端调用 asyncBootstrap 时会在此同时执行此方法
  // 名字必须为 bootstrap
  bootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { appState } = this.props
        appState.count = 3
        resolve(true)
      })
    })
  }

  render() {
    const { tabIndex } = this.state
    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <Tabs onChange={this.changeTab} value={tabIndex}>
          <Tab label="全部" />
          <Tab label="精华" />
          <Tab label="分享" />
          <Tab label="问答" />
          <Tab label="招聘" />
          <Tab label="测试" />
        </Tabs>
      </Container>
    )
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState)
}
