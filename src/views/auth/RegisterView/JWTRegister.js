import React from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import AlertP from 'src/components/Alert';
import { Redirect } from 'react-router';

import {
  Box,
  Button,
  Checkbox,
  FormHelperText,
  TextField,
  Typography,
  Link,
  makeStyles
} from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

const useStyles = makeStyles(() => ({
  root: {}
}));

const JWTRegister = ({ className, ...rest }) => {
  const classes = useStyles();
  const { register, error } = useAuth();
  const isMountedRef = useIsMountedRef();

  if (localStorage.getItem('token')) {
  
    return <Redirect to="app/management/customers" />
    
  }else{
  return (
    <Formik
      initialValues={{
        email: '',
        name: '',
        password: '',
        password2: '',
        policy: false,
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        name: Yup.string().max(255).required('Name is required'),
        password: Yup.string().min(7).max(255).required('Password is required'),
        policy: Yup.boolean().oneOf([true], 'This field must be checked')
      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          if(values.password === values.password2){
            await register(values);

            if (isMountedRef.current) {
              if(!error){
                setStatus({ success: true });
                setSubmitting(false);
              }
            }
          }else{
          setErrors({ submit: 'Passwords do not match' });
          }
        } catch (err) {
          console.error(err);
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
        touched,
        values
      }) => (
        <form
          noValidate
          className={clsx(classes.root, className)}
          onSubmit={handleSubmit}
          {...rest}
        >
          <TextField
            error={Boolean(touched.name && errors.name)}
            fullWidth
            helperText={touched.name && errors.name}
            label="Name"
            margin="normal"
            name="name"
            onBlur={handleBlur}
            onChange={handleChange}
            type="text"
            value={values.name}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password2 && errors.password2)}
            fullWidth
            helperText={touched.password2 && errors.password2}
            label="Confirm Password"
            margin="normal"
            name="password2"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password2}
            variant="outlined"
          />
          <Box
            alignItems="center"
            display="flex"
            mt={2}
            ml={-1}
          >
            <Checkbox
              checked={values.policy}
              name="policy"
              onChange={handleChange}
            />
            <Typography
              variant="body2"
              color="textSecondary"
            >
              I have read the
              {' '}
              <Link
                component="a"
                href="#"
                color="secondary"
              >
                Terms and Conditions
              </Link>
            </Typography>
          </Box>
          {Boolean(touched.policy && errors.policy) && (
            <FormHelperText error>
              {errors.policy}
            </FormHelperText>
          )}
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
              Register
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
  }
};

JWTRegister.propTypes = {
  className: PropTypes.string
};

export default JWTRegister;
