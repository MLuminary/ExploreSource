import React from 'react'
import ReactDom from 'react-dom'

class App extends React.Component {
  render() {
    return (
      <div>This is App</div>
    )
  }
}

// 将 React 转为 dom 并挂载
ReactDom.render(<App />, document.body)