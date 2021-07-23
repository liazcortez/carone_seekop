import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import clsx from 'clsx';
import { Typography, makeStyles } from '@material-ui/core';
import Activity from './Activity';
import useActivity from 'src/hooks/useActivity';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next'

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

const Activities = ({  className, ...rest }) => {
  const classes = useStyles();
  const todayItems = [];
  const lastWeekItems = [];
  const route = useParams();
  const { activities, getActivitiesByQuestLead } = useActivity();
  const { t } = useTranslation();
  useEffect(()=>{
    getActivitiesByQuestLead(route.id)
    //eslint-disable-next-line
    console.log(activities);
  },[])

  // eslint-disable-next-line no-restricted-syntax
  for (const activity of activities) {
    if (moment(activity.createdAt).isSame(moment(), 'day')) {
      todayItems.push(activity);
    } else {
      lastWeekItems.push(activity);
    }
  }

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      {
        todayItems && todayItems.length > 0 ? (  <Typography
          className={classes.title}
          variant="h3"
          color="textPrimary"
        >
          {t("Activities.Today")}
        </Typography>) 
        : false
      }
    
      <div className={classes.group}>
        {todayItems.map((activity) => (
          <Activity
            activity={activity}
            className={classes.activity}
            key={activity.id}
          />
        ))}
      </div>
      <div className={classes.group}>
        <Typography
          className={classes.title}
          variant="h3"
          color="textPrimary"
        >
          {t("Activities.History")}
        </Typography>
        {lastWeekItems.map((activity) => (
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
