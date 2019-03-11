import * as React from 'react'
import * as PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import Helmet from 'react-helmet'

import AppState from '../../store/app-state'

@inject('appState') @observer
export class TopicDetail extends React.Component {
  componentDidMount() {
    // do
  }

  changeName = (event) => {
    const { appState } = this.props
    appState.changeName(event.target.value)
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
    const { appState } = this.props
    return (
      <div>
        <Helmet>
          <title>This is topic detail</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <input type="text" onChange={this.changeName} />
        <span>{ appState.msg }</span>
      </div>
    )
  }
}

TopicDetail.propTypes = {
  appState: PropTypes.instanceOf(AppState)
}
