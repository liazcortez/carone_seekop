import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
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
import AppointmentDetails  from './AppointmentDetails';
import useAuth from 'src/hooks/useAuth';
import {
  Container,
  //Dialog,
  Paper,
  useTheme,
  Modal,
  useMediaQuery,
  makeStyles,
} from '@material-ui/core';
import Page from 'src/components/Page';

import Header from './Header';
import Toolbar from './Toolbar';

/*const selectedEventSelector = (state) => {
  const { events, selectedEventId } = state.calendar;

  if (selectedEventId) {
    return events.find((_event) => _event._id === selectedEventId);
  } else {
    return null;
  }
};*/

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

const CalendarView = () => {
  const classes = useStyles();
  const calendarRef = useRef(null);
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const [date, setDate] = useState(moment().toDate());
  const [view, setView] = useState(mobileDevice ? 'listWeek' : 'dayGridMonth');
  //const [isModalOpen, SetModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const { user } = useAuth();
  const { appointments, getAppointmentsByUser, updateAppointment, getAppointments, getAppointmentsByStore } = useAppointment();
  const [currentAppointment, setCurrentAppointment] = useState();

  const handleDateToday = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleViewChange = (newView) => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleDatePrev = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleDateNext = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleAddClick = () => {
  };

  const handleRangeSelect = (arg) => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.unselect();
    }

  };

  const handleEventOpen = (event) => {
    setCurrentAppointment(event.event)
    setEventModal({
      open: true,
      event: null
    });
  };

  /*const handleEventSelect = (arg) => {
  };*/

  const handleEventResize = async ({ event }) => {
    try {
     
    } catch (err) {
      console.error(err);
    }
  };
  const aux = [];

  const handleEventDrop = async ({ event }) => {
    try {
      //checar esto arthurmoment(date).add(1, 'hours')
      await updateAppointment({
        startDate: moment(event.start).format(),
        endDate:  moment(event.start).add(1, 'hours').format(),
      }, event.id)
    } catch (err) {
      console.error(err);
    }
  };

  const handleModalClose = () => {
    setEventModal({
      open: false,
      event: null
    });
  };

  useEffect(() => {
    
    if(user && user.role ){
      if(user.role === 'admin'){
        getAppointmentsByStore(user.store.id);
      }else if(user.role === 'user'){
        getAppointmentsByUser(user._id);
      }else if(user.role === 'rockstar' || user.role === 'super admin'){
        getAppointments();
      }
    }
    //eslint-disable-next-line
  }, [user]);

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

  useEffect(() => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = mobileDevice ? 'listWeek' : 'dayGridMonth';

      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [mobileDevice]);

  const handleEventAdd = evento => {
    setEventModal({
      open: false,
      event: null
    });
  };

  const [eventModal, setEventModal] = useState({
    open: false,
    event: null
  });

  const handleEventDelete = event => {
    /*setEvents(events => events.filter(e => e.id !== event.id));
    setEventModal({
      open: false,
      event: null
    });*/
  };

  const handleEventEdit = event => {
    /*setEvents(events => events.map(e => (e.id === event.id ? event : e)));
    setEventModal({
      open: false,
      event: null
    });*/
  };

  return (
    <Page
      className={classes.root}
      title="Calendar"
    >
      <Modal
          onClose={handleModalClose}
          open={eventModal.open}
        >
        <AppointmentDetails
          event={eventModal.event}
          onAdd={handleEventAdd}
          onCancel={handleModalClose}
          onDelete={handleEventDelete}
          onEdit={handleEventEdit}
          appointmentA={currentAppointment}
          refreshApp={appointmentRefresh}
        />
      </Modal>
      <Container maxWidth={false}>
        <Header onAddClick={handleAddClick} />
        <Toolbar
          date={date}
          onDateNext={handleDateNext}
          onDatePrev={handleDatePrev}
          onDateToday={handleDateToday}
          onViewChange={handleViewChange}
          view={view}
        />
        <Paper className={classes.calendar}>
          <FullCalendar
            allDayMaintainDuration
            defaultDate={date}
            defaultView={view}
            droppable
            editable
            eventClick={handleEventOpen}
            eventDrop={handleEventDrop}
            eventLimit
            eventResizableFromStart
            eventResize={handleEventResize}
            header={false}
            events={events}
            height={800}
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
        </Paper>
        {/*<Dialog
          maxWidth="sm"
          fullWidth
          onClose={handleModalClose}
          open={isModalOpen}
        >
          Dialog renders its body even if not open 
          isModalOpen && (
            <AddEditEventForm
              event={selectedEvent}
              range={selectedRange}
              onAddComplete={handleModalClose}
              onCancel={handleModalClose}
              onDeleteComplete={handleModalClose}
              onEditComplete={handleModalClose}
            />
          )
        </Dialog>*/}
      </Container>
    </Page>
  );
};

export default CalendarView;
