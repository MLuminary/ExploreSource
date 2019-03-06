import * as React from 'react'
import { Route, Redirect } from 'react-router-dom'

import { TopicList } from '../views/topic-list'
import { TopicDetail } from '../views/topic-detail'

export default () => [
  <Route key="home" path="/" render={() => <Redirect to="/list" />} exact />,
  <Route key="list" path="/list" component={TopicList} />,
  <Route key="detail" path="/detail" component={TopicDetail} />
]
