import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import AlertP from 'src/components/Alert';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  makeStyles,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  root: {}
}));

const GeneralSettings = ({ className, user, ...rest }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { error, updateProfile } = useAuth();
  const [submitedForm, setSubmitedForm] = useState(false);
  const { t } = useTranslation()

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar(t("SnackBar.UserUpdated"), {
          variant: 'success'
        });
      }
      setSubmitedForm(false)
    }

    // eslint-disable-next-line
  }, [submitedForm]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
     
        email: user.email || '',
        name: user.name || '',
        phone: user && user.phone ? user.phone : '',
        job: user && user.job ? user.job : '',
        submit: null

      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email(t("Yup.Email")).max(255).required(t("Yup.EmailReq")),
        name: Yup.string().max(255).required('Name is required'),
      })}
      onSubmit={async (values, {
        resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          
          await updateProfile(values, 'info');
          setSubmitedForm(true);
          
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
        <form onSubmit={handleSubmit}>
          <Card
            className={clsx(classes.root, className)}
            {...rest}
          >
            <CardHeader title={t("Titles.Profile")} />
            <Divider />
            <CardContent>
              <Grid
                container
                spacing={4}
              >
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label={t("Users.Name")}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    label={t("Forms.Email")}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    type="email"
                    value={values.email}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.phone && errors.phone)}
                    fullWidth
                    label={t("Users.Phone")}
                    name="phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phone}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.job && errors.job)}
                    fullWidth
                    label={t("Users.Job")}
                    name="job"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.job}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              {error && error.error !== 'Password is incorrect' ? <AlertP severity="error" msg={error.error}/> : ''}

              {errors.submit && (
                <Box mt={3}>
                  <FormHelperText error>
                    {errors.submit}
                  </FormHelperText>
                </Box>
              )}
            </CardContent>
            <Divider />
            <Box
              p={2}
              display="flex"
              justifyContent="flex-end"
            >
              <Button
                color="secondary"
                disabled={isSubmitting}
                type="submit"
                variant="contained"
              >
                {t("Buttons.Save")}
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>

  );
  
};

GeneralSettings.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object.isRequired
};

export default GeneralSettings;
