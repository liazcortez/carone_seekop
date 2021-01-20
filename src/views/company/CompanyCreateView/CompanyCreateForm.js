import React, { useEffect, useState }  from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import ProfileDetails from '../../account/AccountView/General/ProfileDetails';
import useAuth from 'src/hooks/useAuth';
import useCompany from 'src/hooks/useCompany';
import { useHistory } from 'react-router-dom';
import AlertP from 'src/components/Alert';

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  makeStyles,
  CardHeader,
  Divider,
  FormHelperText,

} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  root: {}
}));

const CompanyCreateForm = ({
  className,
  ...rest
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();  
  const { user } = useAuth();
  const { createCompany, error } = useCompany();
  const { t } = useTranslation();
  const history = useHistory();
  const [submitedForm, setSubmitedForm] = useState(false);

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar(t("SnackBar.CompanyCreated"), {
          variant: 'success'
        });
        history.push('/app/management/companies');
      }
      setSubmitedForm(false)
    }

    // eslint-disable-next-line
  }, [submitedForm]);

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      spacing={3}
      {...rest}
    >
      <Grid
        item
        lg={4}
        md={6}
        xl={3}
        xs={12}
      >
        <ProfileDetails user={user} />

      </Grid>
      <Grid
        item
        lg={8}
        md={6}
        xl={9}
        xs={12}
      >
        <Formik
          enableReinitialize
          initialValues={{
            name: '',
            user: user._id,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(255)
          })}
          onSubmit={async (values, {
            resetForm,
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            try {
              await createCompany(values);
              setSubmitedForm(true)
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
            touched,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              <Card
                className={clsx(classes.root, className)}
                {...rest}
              >
                <CardHeader title={t("Titles.CreateCompany")} />
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
                        label="Name"
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.name}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
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
                    {t("Titles.CreateCompany")}
                  </Button>
                </Box>
              </Card>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

CompanyCreateForm.propTypes = {
  className: PropTypes.string
};

export default CompanyCreateForm;
