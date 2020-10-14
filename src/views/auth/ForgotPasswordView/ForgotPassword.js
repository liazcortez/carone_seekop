import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import AlertP from 'src/components/Alert';
import { Redirect } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import {
  Box,
  Button,
  FormHelperText,
  TextField,
  makeStyles
} from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

const useStyles = makeStyles(() => ({
  root: {}
}));



const ForgotPassword = ({ className, ...rest }) => {

  
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();  
  const { forgotPassword, error } = useAuth();
  const isMountedRef = useIsMountedRef();
  const [submitedForm, setSubmitedForm] = useState(false);

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar('Email sent', {
          variant: 'success'
        });
      }
      setSubmitedForm(false)
    }

    // eslint-disable-next-line
  }, [submitedForm]);
 
  if (localStorage.getItem('token')) {
  
    return <Redirect to="app/management/leads" />
  }else {
  return (
    <Formik
      initialValues={{
        email: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          await forgotPassword(values);
          setSubmitedForm(true);

        } catch (err) {
          if (isMountedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.error });
            setSubmitting(false);
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className={clsx(classes.root, className)}
          {...rest}
        >
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            autoFocus
            helperText={touched.email && errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
            required
          />
          {error && <AlertP severity="error" msg={error.error}/>}
            
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box mt={2}>
            <Button
              color="secondary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Send email
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
          }
};

ForgotPassword.propTypes = {
  className: PropTypes.string,
};

export default ForgotPassword;
