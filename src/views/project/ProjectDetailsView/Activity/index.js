import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import Activity from './Activity';

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    marginBottom: theme.spacing(3)
  },
  group: {
    '& + &': {
      marginTop: theme.spacing(4)
    }
  },
  activity: {
    position: 'relative',
    '& + &': {
      marginTop: theme.spacing(3),
      '&:before': {
        position: 'absolute',
        content: '" "',
        height: 20,
        width: 1,
        top: -20,
        left: 20,
        backgroundColor: theme.palette.divider
      }
    }
  }
}));

const Activities = ({ activities, className, ...rest }) => {
  const classes = useStyles();
  const Items = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const activity of activities) {
      Items.push(activity);
  }

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <div className={classes.group}>
        {Items.map((activity) => (
          <Activity
            activity={activity}
            className={classes.activity}
            key={activity.id}
          />
        ))}
      </div>
    </div>
  );
};

Activities.propTypes = {
  className: PropTypes.string
};

export default Activities;
