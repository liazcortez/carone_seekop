import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';  
import { useSnackbar } from 'notistack';

import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    makeStyles,
    Modal
  } from '@material-ui/core';
  import AddEditEvent  from './AddEditEvent';

  import {
    Calendar as CalendarIcon
  
  } from 'react-feather';
  
  const useStyles = makeStyles((theme) => ({
    root: {},
    cell: {
      padding: theme.spacing(1)
    }
  }));
  
  const Appointment = ({ className, ...rest }) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [eventModal, setEventModal] = useState({
      open: false,
      event: null
    });
    const handleEventNew = () => {
      setEventModal({
        open: true,
        event: null
      });
    };
  
    const handleEventDelete = event => {
      //await deleteAppointment(event._id);
      //await getAppointments();
      //setEvents(events => events.filter(e => e.id !== event.id));
      setEventModal({
        open: false,
        event: null
      });
      enqueueSnackbar('Appointment Deleted', {
        variant: 'error'
      });
    };
  
    const handleModalClose = () => {
      setEventModal({
        open: false,
        event: null
      });
    };
  
    const handleEventAdd = event => {
      setEventModal({
        open: false,
        event: null
      });
    };
  
    const handleEventEdit = event => {
      /*setEvents(events => events.map(e => (e.id === event.id ? event : e)));
      setEventModal({
        open: false,
        event: null
      });*/
    };

    return (
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        
        <Modal
          onClose={handleModalClose}
          open={eventModal.open}
        >
          <AddEditEvent
            event={eventModal.event}
            onAdd={handleEventAdd}
            onCancel={handleModalClose}
            onDelete={handleEventDelete}
            onEdit={handleEventEdit}
          />
        </Modal>
        <CardHeader title="Appointment" />
        <Divider />
        <CardContent>
          <Box mt={2}>
            <Button
              variant="contained"
              type="submit"
              size="large"
              fullWidth
              color="primary"
              startIcon={<CalendarIcon />}
              onClick={handleEventNew}
            >
              Make Appointment
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  Appointment.propTypes = {
    className: PropTypes.string,
  };
  
  export default Appointment;
  