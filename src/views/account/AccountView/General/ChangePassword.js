import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import AlertP from 'src/components/Alert';
import useAuth from 'src/hooks/useAuth';
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

const ChangePassword = ({ className, ...rest }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { error, updatePassword } = useAuth();
  const [submitedForm, setSubmitedForm] = useState(false);
  const { t } = useTranslation()

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar(t("SnackBar.PasswordUpdated"), {
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
     
        currentPassword: '',
        newPassword: '',
        submit: null

      }}
      onSubmit={async (values, {
        resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          
          await updatePassword(values);
          setSubmitedForm(true)
          resetForm();

          
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
            <CardHeader title={t("Users.Password1")} />
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
                    error={Boolean(touched.currentPassword && errors.currentPassword)}
                    fullWidth
                    helperText={touched.currentPassword && errors.currentPassword}
                    label={t("Account.CurrentPassword")}
                    name="currentPassword"
                    required
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.currentPassword}
                    variant="outlined"
                    type="password"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.newPassword && errors.newPassword)}
                    fullWidth
                    label={t("Account.NewPassword")}
                    name="newPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    type="password"
                    value={values.newPassword}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              {error && error.error === 'Password is incorrect' ? <AlertP severity="error" msg={error.error}/> : ''}

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

ChangePassword.propTypes = {
  className: PropTypes.string,
};

export default ChangePassword;
