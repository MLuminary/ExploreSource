import React from 'react'
import * as ReactDOM from 'react-dom'

export default class App extends React.Component {
  render() {
    return (
      <div>This is App</div>
    )
  }
}

// 将 React 转为 dom 并挂载
if (typeof window !== 'undefined') {
  ReactDOM.hydrate(<App />, document.getElementById('root'))
}
