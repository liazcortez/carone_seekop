/* eslint no-unused-vars: 0 */
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import clsx from 'clsx';
import GenericMoreButton from 'src/components/GenericMoreButton';
import PerfectScrollbar from 'react-perfect-scrollbar';
import React, {
  useState,
  useRef,
  useEffect
} from 'react';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timelinePlugin from '@fullcalendar/timeline';
import useAppointment from 'src/hooks/useAppointment';
import useAuth from 'src/hooks/useAuth';
import {
  Card,
  CardHeader,
  makeStyles,
  Divider,
  CardContent,
  Typography
} from '@material-ui/core';

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
  }
}));

const CalendarView = ({ className, ...rest }) => {
  const classes = useStyles();
  const calendarRef = useRef(null);
  const [date, setDate] = useState(moment().toDate());
  const [events, setEvents] = useState([]);
  const { appointments, getAppointmentsByStore, getAppointmentsByUser, getAppointments } = useAppointment();
  const { user } = useAuth();

  const handleRangeSelect = (arg) => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.unselect();
    }

  };
  const handleEventResize = async ({ event }) => {
    try {
     
    } catch (err) {
      console.error(err);
    }
  };
  
  const aux = [];

  useEffect(()=>{
    
    if(user && user.store && user.role){
      if(user.role === 'admin'){
        getAppointmentsByStore(user.store._id);
      }else if(user.role === 'user'){
        getAppointmentsByUser(user._id);
      }else if(user.role === 'rockstar' || user.role === 'super admin'){
        getAppointments();
      }
    }
    //eslint-disable-next-line
  },[user])

  const appointmentRefresh = (appo) =>{
      if(appo){
        appo.map( app => 
          aux.push(
            {
              id: app._id,
              allDay: false,
              color: null,
              description: app.description,
              end: app.endDate,
              start: app.startDate,
              title: app.title
            }
          )
        )
      }
      setEvents(aux);
  }

  useEffect(() => {
    appointmentRefresh(appointments);
    //eslint-disable-next-line
  }, [appointments])

  return (
      <Card
        className={classes.calendar}
        {...rest}
        style={{marginTop: 0, paddingTop: 0}}
      >
        <CardHeader
        action={<GenericMoreButton />}
        title={'Calendar'}
        />
        <Divider />
        <PerfectScrollbar>

        <CardContent>

        {
          events && events.length > 0 ?
          (
          <FullCalendar
            height={432}
            allDayMaintainDuration
            defaultDate={date}
            defaultView={'listWeek'}
            droppable
            editable
            eventLimit
            eventResizableFromStart
            eventResize={handleEventResize}
            header={false}
            events={events}
            ref={calendarRef}
            rerenderDelay={10}
            select={handleRangeSelect}
            selectable
            weekends
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
              timelinePlugin
            ]}
          />
          ):
          (
          <Card className={clsx(classes.root, className)}
          {...rest}
          >
            <CardContent>
              <Typography align="center" variant="h5" color="textPrimary">
                No events
              </Typography>
            </CardContent>
          </Card>
          )
        }
          
          
      </CardContent>
      </PerfectScrollbar>
      </Card>
  );
};

export default CalendarView;
