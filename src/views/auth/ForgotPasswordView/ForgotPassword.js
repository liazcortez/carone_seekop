import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import AlertP from 'src/components/Alert';
import { Redirect } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation();
  const { forgotPassword, error, clearState } = useAuth();
  const isMountedRef = useIsMountedRef();
  const [submitedForm, setSubmitedForm] = useState(false);

  useEffect(() => {
    clearState()
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar(t("SnackBar.EmailSent")
        , {
          variant: 'success'
        });
      }
      setSubmitedForm(false)
    }

    // eslint-disable-next-line
  }, [submitedForm]);
 
  if (localStorage.getItem('token')) {
  
    return <Redirect to="/app/management/omsLeads" />
  }else {
  return (
    <Formik
      initialValues={{
        email: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email(t("Yup.Email")).max(255).required(t("Yup.EmailReq")),

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
            label={t("Forms.Email")}
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
              {t("Buttons.SendEmail")}
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
