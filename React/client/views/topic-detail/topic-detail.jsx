import * as React from 'react'
import * as PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { AppState } from '../../store/app-state'

@inject('appState') @observer
export class TopicDetail extends React.Component {
  componentDidMount() {
    // do
  }

  changeName = (event) => {
    const { appState } = this.props
    appState.changeName(event.target.value)
  }

  render() {
    const { appState } = this.props
    return (
      <div>
        <input type="text" onChange={this.changeName} />
        <span>{ appState.msg }</span>
      </div>
    )
  }
}

TopicDetail.propTypes = {
  appState: PropTypes.instanceOf(AppState)
}
