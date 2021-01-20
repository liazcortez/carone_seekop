import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import AlertP from 'src/components/Alert';
import { Redirect, useParams, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
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



const ResetPassword = ({ className, ...rest }) => {

  
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();  
  const { resetPassword, error, clearState } = useAuth();
  const { t } = useTranslation();
  const isMountedRef = useIsMountedRef();
  const route = useParams();
  const [submitedForm, setSubmitedForm] = useState(false);
  const history = useHistory();

  useEffect(() => {
    clearState()
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar('Password updated', {
          variant: 'success'
        });

        history.push('/login');
      }
      setSubmitedForm(false);
    }

    // eslint-disable-next-line
  }, [submitedForm]);
 
  if (localStorage.getItem('token')) {
  
    return <Redirect to="/app/management/omsLeads" />
  }else {
  return (
    <Formik
      initialValues={{
        password: '',
        newPassword: '',
        token: route.token || '',
        submit: null
      }}
  
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {

          if(values.password === values.newPassword){
            await resetPassword(values);
            setSubmitedForm(true);
          }else{
            setErrors({ submit: t("Errors.Passwords") });
          }

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
            error={Boolean(touched.password && errors.password)}
            fullWidth
            autoFocus
            helperText={touched.password && errors.password}
            label={t("Forms.NewPassword")}
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            required
            value={values.password}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.newPassword && errors.newPassword)}
            fullWidth
            autoFocus
            helperText={touched.newPassword && errors.newPassword}
            label={t("Forms.ConfirmPassword")}
            margin="normal"
            name="newPassword"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.newPassword}
            required
            variant="outlined"
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
              {t("Buttons.ResetPassword")}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
          }
};

ResetPassword.propTypes = {
  className: PropTypes.string,
};

export default ResetPassword;
