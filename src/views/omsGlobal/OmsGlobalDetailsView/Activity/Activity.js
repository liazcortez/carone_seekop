import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
  Avatar,
  Card,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import {
  PlusCircle as AddIcon,
  Trash2 as DeleteIcon,
  Edit3 as EditIcon,
  Mail as MailIcon,
  CheckSquare as AppointmentIcon,
  MessageCircle as CommentIcon,
  Video as VideoCallIcon,
  Phone as CallIcon

} from 'react-feather';
import { useTranslation } from 'react-i18next'

const avatarsMap = {
  update: {
    icon: EditIcon,
    className: 'avatarBlue'
  },
  mailing: {
    icon: MailIcon,
    className: 'avatarOrange'
  },
  add: {
    icon: AddIcon,
    className: 'avatarGreen'
  },
  delete: {
    icon: DeleteIcon,
    className: 'avatarIndigo'
  },
  appointment: {
    icon: AppointmentIcon,
    className: 'avatarIndigo'
  },
  comment: {
    icon: CommentIcon,
    className: 'avatarTeal'
  },
  videocall: {
    icon: VideoCallIcon,
    className: 'avatarGray'
  },
  call: {
    icon: CallIcon,
    className: 'avatarGreen'
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  card: {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
    display: 'flex',
    padding: theme.spacing(2),
    alignItems: 'center'
  },
  date: {
    marginLeft: 'auto',
    flexShrink: 0
  },
  avatar: {
    color: colors.common.white
  },
  avatarBlue: {
    backgroundColor: colors.blue[500]
  },
  avatarGreen: {
    backgroundColor: colors.green[500]
  },
  avatarOrange: {
    backgroundColor: colors.orange[500]
  },
  avatarIndigo: {
    backgroundColor: colors.deepPurple[500]
  },
  avatarTeal: {
    backgroundColor: colors.teal[500]
  },
  avatarGray: {
    backgroundColor: colors.grey[500]
  }
}));

const Activity = ({ activity, className, ...rest }) => {
  const { t } = useTranslation()
  const classes = useStyles();
  const avatar = avatarsMap[activity.action];
  const desc = activity.description.split(' ');

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Avatar className={clsx(classes.avatar, classes[avatar.className])}>
        <avatar.icon />
      </Avatar>
      <Card className={classes.card}>
        <Typography
          variant="body1"
          color="textPrimary"
        >
          {' '}
          {desc[0]} {(activity.action === 'update')?((desc[desc.length - 1]==='Lead')?t(`Activities.Action.update`):t(`Activities.Action.status.${desc[desc.length - 1]}`)):((activity.action === 'call')?(t(`Activities.Action.${activity.action}`) + ' ' + activity.global.name):t(`Activities.Action.${activity.action}`))}

        </Typography>
        <Typography
          className={classes.date}
          variant="caption"
        >
          {moment(activity.createdAt).fromNow()}
        </Typography>
      </Card>
    </div>
  );
};

Activity.propTypes = {
  className: PropTypes.string
};

export default Activity;
