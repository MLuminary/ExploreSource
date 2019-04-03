import React from 'react'
import PropTypes from 'prop-types'

import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/es/styles'
import { topicPrimaryStyle, topicSecondaryStyle } from './style'

const Primary = ({ classes, topic }) => (
  <div className={classes.root}>
    <span className={classes.tab}>{ topic.tab }</span>
    <span className={classes.title}>{ topic.title }</span>
  </div>
)

const StyledPrimary = withStyles(topicPrimaryStyle)(Primary)

const Secondary = ({ classes, topic }) => (
  <div className={classes.root}>
    <span className={classes.userName}>{ topic.username }</span>
    <span className={classes.count}>
      <span className={classes.accentColor}>{ topic.reply_count }</span>
      <span> / </span>
      <span>{ topic.visit_count }</span>
    </span>
    <span>
      创建时间:
      { topic.create_at }
    </span>
  </div>
)

const StyledSecondary = withStyles(topicSecondaryStyle)(Secondary)

export const TopicListItem = ({ onClick, topic }) => (
  <ListItem button onClick={onClick}>
    <ListItemAvatar>
      <Avatar src={topic.image} />
    </ListItemAvatar>
    <ListItemText
      primary={<StyledPrimary topic={topic} />}
      secondary={<StyledSecondary topic={topic} />}
    />
  </ListItem>
)

TopicListItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  topic: PropTypes.object.isRequired
}

Primary.propTypes = {
  classes: PropTypes.object.isRequired,
  topic: PropTypes.object.isRequired
}

Secondary.propTypes = {
  classes: PropTypes.object.isRequired,
  topic: PropTypes.object.isRequired
}
