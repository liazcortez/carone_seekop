import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import ProfileDetails from '../../account/AccountView/General/ProfileDetails';
import useAuth from 'src/hooks/useAuth';
import { CapitalizeNames } from 'src/utils/capitalize'
import useMake from 'src/hooks/useMake';
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
  Typography
} from '@material-ui/core';
import useStore from 'src/hooks/useStore';
import { useTranslation } from 'react-i18next';
import Spinner from 'src/components/Spinner';

const useStyles = makeStyles(() => ({
  root: {}
}));

const StoreCreateForm = ({
  className,
  ...rest
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();  
  const { user } = useAuth();
  const { makes, getMakes } = useMake();
  const { createStore, error, loading, clearState } = useStore();
  const history = useHistory();
  const { t } = useTranslation()

  const [submitedForm, setSubmitedForm] = useState(false);

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar(t("SnackBar.StoreCreated"), {
          variant: 'success'
        });
        history.push('/app/management/stores');
      }
      setSubmitedForm(false)
    }

    // eslint-disable-next-line
  }, [submitedForm]);

  useEffect(() => { 
    getMakes();
    clearState()
    // eslint-disable-next-line 
  }, [])

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
            address: '',
            make: '',
            phone: '',
            description: '',
            user: user._id,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(255),
            description: Yup.string().max(255),
            phone: Yup.number().typeError(t("Yup.Number"))

          })}
          onSubmit={async (values, {
            resetForm,
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            try {
             
              await createStore(values);
              setSubmitedForm(true);

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
                <CardHeader title={t("Titles.CreateStore")} />
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
                        label={t("Forms.Name")}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
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
                        error={Boolean(touched.address && errors.address)}
                        fullWidth
                        helperText={touched.address && errors.address}
                        label={t("Forms.Address")}
                        name="address"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.address}
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
                        helperText={touched.phone && errors.phone}
                        label={t("Forms.Phone")}
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
                        error={Boolean(touched.make && errors.make)}
                        fullWidth
                        helperText={touched.make && errors.make}
                        label={t("Forms.Make")}
                        name="make"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        select
                        variant="outlined"
                        SelectProps={{ native: true }}
                      >
                          <option key={0} value={''}>
                          </option>

                        {makes && makes.map(make => (
                          <option key={make._id} value={make._id}>
                            {CapitalizeNames(make.name)}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.description && errors.description)}
                        fullWidth
                        helperText={touched.description && errors.description}
                        label={t("Forms.Description")}
                        name="description"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.description}
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
                 { loading ? 
                    (
                      <>
                          <Typography style={{marginTop: 10}} variant='h5'>{t("Buttons.Creating")}</Typography><Spinner style={{paddingRight: 10}} width={45}/>
                      </>
                    ) : 
                    (
                      <Button
                        color="secondary"
                        disabled={isSubmitting}
                        type="submit"
                        variant="contained"
                      >
                        {t("BreadCumbs.Create")}{t("Stores.Store")}
                      </Button>
                    )}
                </Box>
              </Card>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

StoreCreateForm.propTypes = {
  className: PropTypes.string
};

export default StoreCreateForm;
