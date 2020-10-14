import React, { forwardRef, useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import useAppointment from 'src/hooks/useAppointment';
import useAuth from 'src/hooks/useAuth';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { makeStyles } from '@material-ui/styles';
import { DateTimePicker } from '@material-ui/pickers';
import AlertP from 'src/components/Alert';
import Label from 'src/components/Label';
import moment from 'moment';
import {
  Card,
  FormHelperText,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Box,
  Button,
  Divider,
  colors
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 700,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  field: {
    marginTop: theme.spacing(3)
  },
  confirmButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    },
    marginLeft: theme.spacing(2)
  },
  cancelButton: {
    color: theme.palette.white,
    backgroundColor: colors.red[600],
    '&:hover': {
      backgroundColor: colors.red[900]
    },
    marginLeft: theme.spacing(2)
  },
  actions: {
    float: 'right'
  },
  capitalize: {
    'text-transform': 'capitalize'
  }
}));

const AddEditEvent = forwardRef((props, ref) => {
  const {
    event,
    onDelete,
    onCancel,
    onAdd,
    onEdit,
    className,
    appointmentA,
    refreshApp,
    ...rest
  } = props;
  const classes = useStyles();
  const {
    getAppointment,
    deleteAppointment,
    updateAppointment,
    error,
    getAppointments,
    appointment,
    getAppointmentsByUser,
    getAppointmentsByStore
  } = useAppointment();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const [submitedForm, setSubmitedForm] = useState(false);

  useEffect(() => {

    if (submitedForm) {
      if (!error) {
        enqueueSnackbar('Appointment updated', {
          variant: 'success'
        });
      }
      setSubmitedForm(false);
      onAdd();
    }

    // eslint-disable-next-line
  }, [submitedForm]);

  useEffect(() => {
    getAppointment(appointmentA.id);
    // eslint-disable-next-line
  }, []);

  const handleDelete = async () => {
    onCancel();

    await deleteAppointment(appointmentA.id);

    if(user.role === 'rockstar' || user.role === 'super admin'){
    await getAppointments();
      
    }
    if(user.role === 'admin'){
    await getAppointmentsByStore(user.store._id);
      
    }
    if(user.role === 'user'){
    await getAppointmentsByUser(user._id);
      
    }
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)} ref={ref}>
      <Formik
        initialValues={{
          startDate: appointmentA.start,
          endDate: appointmentA.end,
          title: appointmentA.title,
          description: appointmentA._def.extendedProps.description
        }}
        validationSchema={Yup.object().shape({
          description: Yup.string().max(5000),
          endDate: Yup.date().when(
            'start',
            (start, schema) =>
              start &&
              schema.min(start, 'End date must be later than start date')
          ),
          startDate: Yup.date(),
          title: Yup.string()
            .max(255)
            .required('Title is required')
        })}
        onSubmit={async (
          values,
          { resetForm, setErrors, setStatus, setSubmitting }
        ) => {
          try {
             await updateAppointment(values, appointmentA.id);
              if(user.role === 'rockstar' || user.role === 'super admin'){
              await getAppointments();
                
              }
              if(user.role === 'admin'){
              await getAppointmentsByStore(user.store._id);
                
              }
              if(user.role === 'user'){
              await getAppointmentsByUser(user._id);
                
              }
            setSubmitedForm(true);
            resetForm();
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldTouched,
          setFieldValue,
          touched,
          values
        }) => (
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Box style={{ float: 'right' }}>
                {appointment && appointment.action && (
                  <Label
                    className={classes.capitalize}
                    color={
                      appointment.action === 'mailing'
                        ? 'warning'
                        : appointment.action === 'information'
                        ? 'error'
                        : appointment.action === 'documentation'
                        ? 'blue'
                        : appointment.action === 'calling'
                        ? 'success'
                        : false
                    }
                  >
                    {appointment.action}
                  </Label>
                )}
              </Box>
              <Box p={2}>
                <Box p={1}>
                  <Typography
                    align="center"
                    gutterBottom
                    variant="h3"
                    color="textPrimary"
                  >
                    Edit Appointment
                  </Typography>
                </Box>
                <Box mt={1}>
                  <TextField
                    error={Boolean(touched.title && errors.title)}
                    helperText={touched.title && errors.title}
                    onBlur={handleBlur}
                    className={classes.field}
                    fullWidth
                    label="Title"
                    name="title"
                    required
                    onChange={handleChange}
                    value={values.title}
                    variant="outlined"
                  />
                </Box>
                <Box mt={1}>
                  <TextField
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                    onBlur={handleBlur}
                    className={classes.field}
                    fullWidth
                    required
                    label="Description"
                    name="description"
                    onChange={handleChange}
                    value={values.description}
                    variant="outlined"
                  />
                </Box>
                <Box mt={4}>
                  <DateTimePicker
                    error={Boolean(touched.startDate && errors.startDate)}
                    onBlur={handleBlur}
                    helperText={touched.startDate && errors.startDate}
                    fullWidth
                    required
                    inputVariant="outlined"
                    label="Start date"
                    name="startDate"
                    onClick={() => setFieldTouched('end')}
                    onChange={date => {
                      setFieldValue('startDate', date)
                      setFieldValue('endDate', moment(date).add(1, 'hours'))}}
                    value={values.startDate}
                  />
                </Box>
                <Box mt={4}>
                  <DateTimePicker
                    error={Boolean(touched.endDate && errors.endDate)}
                    helperText={touched.endDate && errors.endDate}
                    onBlur={handleBlur}
                    fullWidth
                    required
                    inputVariant="outlined"
                    label="End date"
                    name="endDate"
                    onClick={() => setFieldTouched('end')}
                    onChange={date => setFieldValue('endDate', date)}
                    value={values.endDate}
                  />
                </Box>
              </Box>
              {error && <AlertP severity="error" msg={error.error} />}

              {errors.submit && (
                <Box mt={3}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Box>
              )}
            </CardContent>
            <div style={{ padding: '0 1em' }}>
              <Box p={1}>
                <Typography
                  align="center"
                  gutterBottom
                  variant="h3"
                  color="textPrimary"
                >
                  Lead Info
                </Typography>
              </Box>
              <Divider />

              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.fontWeightMedium}>
                      Name
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {appointment &&
                          appointment.lead &&
                          appointment.lead.name}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.fontWeightMedium}>
                      Email
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {appointment &&
                          appointment.lead &&
                          appointment.lead.email}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.fontWeightMedium}>
                      Phone
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {appointment &&
                          appointment.lead &&
                          appointment.lead.phone}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.fontWeightMedium}>
                      Make
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {appointment &&
                          appointment.lead &&
                          appointment.lead.store &&
                          appointment.lead.store.make &&
                          appointment.lead.store.make.name}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.fontWeightMedium}>
                      Model
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {appointment &&
                          appointment.lead &&
                          appointment.lead.vehicle &&
                          appointment.lead.vehicle.model}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Divider />
            </div>
            <Box p={2}>
              <CardActions>
                <Button
                  onClick={handleDelete}
                  variant="contained"
                  type="submit"
                  color="secondary"
                  className={classes.cancelButton}
                >
                  <DeleteIcon /> Delete
                </Button>

                <Box flexGrow={1} />

                <Button
                  onClick={onCancel}
                  variant="contained"
                  type="submit"
                  color="primary"
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  type="submit"
                >
                  Save
                </Button>
              </CardActions>
            </Box>
          </form>
        )}
      </Formik>
    </Card>
  );
});

AddEditEvent.propTypes = {
  className: PropTypes.string,
  event: PropTypes.object,
  onAdd: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};

export default AddEditEvent;
