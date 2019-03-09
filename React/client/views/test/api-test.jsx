import * as React from 'react'
import axios from 'axios'

/*eslint-disable*/
export default class TestApi extends React.Component {

  getTopics = () => {
    axios.get('/api/topics').then(res => {
      console.info(res)
    })
  }

  login = () => {
    axios.post('/api/user/login', {
      accessToken: '2641a4b9-b3cc-48d5-b9b2-13562a76a8a0'
    }).then(res => {
      console.info(res)
    })
  }

  markAll = () => {
    axios.post('/api/message/mark_all?needAccessToken=true')
      .then(res=> {
        console.info(res)
      })
  }

  render() {
    return (
      <div>
        <button onClick={this.getTopics}>getTopics</button>
        <button onClick={this.login}>login</button>
        <button onClick={this.markAll}>markAll</button>
      </div>
    )
  }
}
