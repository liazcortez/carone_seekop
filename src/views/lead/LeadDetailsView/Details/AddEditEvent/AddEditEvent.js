import React, { forwardRef, useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import useAppointment from 'src/hooks/useAppointment';
import AlertP from 'src/components/Alert';
import { useParams } from 'react-router';
import { DateTimePicker } from '@material-ui/pickers';
import useLead from 'src/hooks/useLead';
import moment from 'moment';

import { makeStyles } from '@material-ui/styles';
import {
  Card,
  FormHelperText,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Box,
  Button,
  IconButton,
  Divider,
  colors,
  SvgIcon
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
    ...rest
  } = props;

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { createAppointment, error } = useAppointment();
  const route = useParams();
  const { lead } = useLead();

  const [submitedForm, setSubmitedForm] = useState(false);

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar('Appointment created', {
          variant: 'success'
        });
      }
      setSubmitedForm(false)
      onAdd();

    }

    // eslint-disable-next-line
  }, [submitedForm]);

  const handleDelete = () => {
    
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
      ref={ref}
    >
      <Formik
      initialValues={{
        title: '',
        description: '',
        startDate: moment(),
        endDate: moment().add(1,'hours'),
        lead: route.id,
        email: lead.email,
        action: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        title: Yup.string().max(255),
        description: Yup.string().max(255),
        startDate: Yup.date(),
        endDate: Yup.date()
        .when(
          'startDate',
          (start, schema) => (start && schema.min(start, 'End date must be later than start date'))
        ),
      })}
      onSubmit={async (values, {
        resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }) => {

        try{
          await createAppointment(values);
          setSubmitedForm(true);
          resetForm();
        }catch(err){
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
          <Box p={2}>
          <Box p={1}>
            <Typography
              align="center"
              gutterBottom
              variant="h3"
              color="textPrimary"
            >
              Make Appointment
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
          <TextField
            error={Boolean(touched.action && errors.action)}
            fullWidth
            helperText={touched.action && errors.action}
            label="Action"
            name="action"
            onBlur={handleBlur}
            onChange={handleChange}
            select
            required
            variant="outlined"
            SelectProps={{ native: true }}
          >
            <option key={0} value={''}></option>
            <option key={1} value={'information'}>Information</option>
            <option key={2} value={'documentation'}>Documentation</option>
            <option key={3} value={'mailing'}>Mailing</option>
            <option key={4} value={'calling'}>Calling</option>
                  
          </TextField>
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
                onChange={(date) => {
                  setFieldValue('startDate', date)
                  setFieldValue('endDate', moment(date).add(1, 'hours'))
                }}
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
                onChange={(date) => setFieldValue('endDate', date)}
                value={values.endDate}
              />
            </Box>
        </Box>
        {error && <AlertP severity="error" msg={error.error}/>}

        {errors.submit && (
          <Box mt={3}>
            <FormHelperText error>
              {errors.submit}
            </FormHelperText>
          </Box>
        )}
        </CardContent>
        <Divider />
        <Box p={2}>
        <CardActions>
            <IconButton onClick={() => handleDelete()}>
              <SvgIcon>
                <DeleteIcon />
              </SvgIcon>
          </IconButton>
          <Box flexGrow={1} />

            <Button 
              onClick={onCancel}
              variant="contained"
              type="submit"
              color="secondary"
              className={classes.cancelButton}

            >
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={isSubmitting}
              variant="contained"
              type="submit"
            >
              Add
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
