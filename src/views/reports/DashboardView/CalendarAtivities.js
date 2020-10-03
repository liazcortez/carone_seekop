/* eslint no-unused-vars: 0 */
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import Label from 'src/components/Label';
import clsx from 'clsx';
import GenericMoreButton from 'src/components/GenericMoreButton';
import PerfectScrollbar from 'react-perfect-scrollbar';
import React, { useEffect, useState } from 'react';
import daysAppointment from 'src/utils/appointmentsDays';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';

import {
  Card,
  CardHeader,
  makeStyles,
  Divider,
  Box,
  Tooltip,
  CardContent,
  Typography,
  MenuList,
  MenuItem
} from '@material-ui/core';

import {
  CheckCircle as CheckIcon
}from 'react-feather'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  calendar: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    '& .fc-unthemed .fc-head': {
      backgroundColor: theme.palette.background.dark
    },
    '& .fc-unthemed .fc-body': {
      backgroundColor: theme.palette.background.default
    },
    '& .fc-unthemed .fc-row': {
      borderColor: theme.palette.divider
    },
    '& .fc-unthemed .fc-axis': {
      ...theme.typography.body2
    },
    '& .fc-unthemed .fc-divider': {
      backgroundColor: theme.palette.background.dark,
      borderColor: theme.palette.divider
    },
    '& .fc-unthemed th': {
      borderColor: theme.palette.divider
    },
    '& .fc-unthemed td': {
      borderColor: theme.palette.divider
    },
    '& .fc-unthemed td.fc-today': {
      backgroundColor: theme.palette.background.dark
    },
    '& .fc-unthemed .fc-highlight': {
      backgroundColor: theme.palette.background.dark
    },
    '& .fc-unthemed .fc-event': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      borderWidth: 2,
      opacity: 0.9,
      '& .fc-time': {
        ...theme.typography.h6,
        color: 'inherit'
      },
      '& .fc-title': {
        ...theme.typography.body1,
        color: 'inherit'
      }
    },
    '& .fc-unthemed .fc-day-top': {
      ...theme.typography.body2
    },
    '& .fc-unthemed .fc-day-header': {
      ...theme.typography.subtitle2,
      fontWeight: theme.typography.fontWeightMedium,
      color: theme.palette.text.secondary,
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.dark
    },
    '& .fc-unthemed .fc-list-view': {
      borderColor: theme.palette.divider
    },
    '& .fc-unthemed .fc-list-empty': {
      ...theme.typography.subtitle1
    },
    '& .fc-unthemed .fc-list-heading td': {
      backgroundColor: theme.palette.background.dark,
      borderColor: theme.palette.divider
    },
    '& .fc-unthemed .fc-list-heading-main': {
      ...theme.typography.h6
    },
    '& .fc-unthemed .fc-list-heading-alt': {
      ...theme.typography.h6
    },
    '& .fc-unthemed .fc-list-item:hover td': {
      backgroundColor: theme.palette.background.dark,
    },
    '& .fc-unthemed .fc-list-item-title': {
      ...theme.typography.body1
    },
    '& .fc-unthemed .fc-list-item-time': {
      ...theme.typography.body2
    }
  },
  capitalize: {
    'text-transform': 'capitalize'
  },
  actions:{
    float: 'right',
    position: 'absolute',
    right: 0
  },
}));

const CalendarView = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
      <Card
        className={classes.calendar}
        {...rest}
        style={{marginTop: 0, paddingTop: 0}}
      >
        <CardHeader
        action={<GenericMoreButton />}
        title='Events'
        />
        <Divider />
        <PerfectScrollbar>

        <CardContent>
        <MenuList>
        {
          rest && rest.appointments && rest.appointments.map( app => 
            (
              <div>
              <MenuItem key={app._id} style={{padding: '1em'}}>
                <ListItemIcon>
                  <CheckIcon fontSize="small" />
                </ListItemIcon>
                <Tooltip
                  key={app.title}
                  title={app.title}
                >
                  <Typography style={{width: '64%', 'text-overflow': 'ellipsis', overflow: 'hidden'}}variant="inherit">{app.title}</Typography>
                </Tooltip>
                <Box className={classes.actions} style={{marginRight: 10}}>
                
                  <Label
                    className={classes.capitalize}
                    color={
                      app.action === 'mailing'
                        ? 'warning'
                        : app.action === 'information'
                        ? 'error'
                        : app.action === 'documentation'
                        ? 'blue'
                        : app.action === 'calling'
                        ? 'success'
                        : false
                    }
                  >
                    {app.action}
                  </Label>
                </Box>
              </MenuItem>
              <Divider />
              </div>
                ))
        }
            
          {/* //     )  
          //   <MenuItem>
          //   <ListItemIcon>
          //     <SendIcon fontSize="small" />
          //   </ListItemIcon>
          //   <Typography variant="inherit">No events to display</Typography>
          // </MenuItem>
         */}
        </MenuList>
        </CardContent>
      </PerfectScrollbar>
      </Card>
  );
};

export default CalendarView;
