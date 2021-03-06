// 代理所有发向 cNode 的接口
const axios = require('axios')
const querystring = require('querystring')

const baseUrl = 'https://cnodejs.org/api/v1'

module.exports = function (req, res, next) {
  const path = req.path
  const user = req.session.user || {}
  const needAccessToken = req.query.needAccessToken

  if(needAccessToken && !user.accessToken) {
    res.status(401).send({
      success: false,
      msg: 'need login'
    })
  }

  const query = Object.assign({}, req.query, {
    // 当请求方式为 get 但是还需要 accesstoken 时
    accesstoken: needAccessToken && req.method === 'GET' ? user.accessToken : ''
  })
  if(query.needAccessToken) delete query.needAccessToken

  axios(`${baseUrl}${path}`, {
    method: req.method,
    params: query,
    data: querystring.stringify(Object.assign({}, req.body, {
      // 当请求方式为 Post 时才需要再 body 中传 accessToken
      accesstoken: ( needAccessToken && req.method === 'POST' ) ? user.accessToken : ''
    })),
    headers: {
      'ContentType': 'application/x-www-form-urlencoded'
    }
  }).then(resp => {
    if(resp.status === 200) {
      res.send(resp.data)
    } else {
      res.status(resp.status).send(resp.data)
    }
  }).catch(err => {
    if(err.response) {
      res.status(500).send(err.response.data)
    } else {
      res.status(500).send({
        success: false,
        msg: '未知错误'
      })
    }
  })
}

