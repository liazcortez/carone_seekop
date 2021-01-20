import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import ProfileDetails from '../../account/AccountView/General/ProfileDetails';
import useAuth from 'src/hooks/useAuth';
import useVehicle from 'src/hooks/useVehicle';
import { useHistory } from 'react-router-dom';
import { CapitalizeNames } from 'src/utils/capitalize';
import useMake from 'src/hooks/useMake';
import AlertP from 'src/components/Alert';
import Spinner from 'src/components/Spinner';

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  makeStyles,
  FormHelperText,
  Typography
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  root: {}
}));

const modelTypeOptions = [
  {
    value: 'suv',
    id: 1
  },
  {
    value: 'sedan',
    id: 2
  },
  {
    value: 'pickup',
    id: 3
  }];

const VehicleCreateForm = ({
  className,
  ...rest
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();  
  const { user } = useAuth();
  const { createVehicle, error, loading, clearState } = useVehicle();
  const history = useHistory();
  const { makes, getMakes } = useMake();
  const [submitedForm, setSubmitedForm] = useState(false);
  const { t } = useTranslation()

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar(t("SnackBar.VehicleCreated"), {
          variant: 'success'
        });
        history.push('/app/management/vehicles');
      }
      setSubmitedForm(false)
    }

    // eslint-disable-next-line
  }, [submitedForm]);

  useEffect(() => {
    clearState()
    getMakes();
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
          initialValues={{
            model: '',
            description: '',
            modelType: '',
            make: '',
            price: '',
            user: user._id,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            model: Yup.string().max(255),
            description: Yup.string().max(255),
            price: Yup.number().typeError(t("Yup.Number"))
          })}
          onSubmit={async (values, {
            resetForm,
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            try {
              await createVehicle(values);
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
            <form
              className={clsx(classes.root, className)}
              onSubmit={handleSubmit}
              {...rest}
            >
              <Card>
                <CardContent>
                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.model && errors.modelType)}
                        fullWidth
                        helperText={touched.model && errors.model}
                        label={t("Forms.Model")}
                        name="model"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.model}
                        variant="outlined"
                      />
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
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.modelType && errors.modelType)}
                        fullWidth
                        helperText={touched.modelType && errors.modelType}
                        label={t("Forms.ModelType")}
                        name="modelType"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.modelType}
                        variant="outlined"
                        select
                        SelectProps={{ native: true }}

                      >
                        <option key={0} value={''}></option>
                        {modelTypeOptions && modelTypeOptions.map(option => (
                            <option key={option.id} value={option.value}>
                              {CapitalizeNames(option.value)}
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
                        error={Boolean(touched.make && errors.make)}
                        fullWidth
                        helperText={touched.make && errors.make}
                        name='make'
                        label={t("Forms.Make")}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        select
                        required
                        variant="outlined"
                        SelectProps={{ native: true }}            
                        value={values.make}
                      >
                        <option key={0} value={''}></option>
                        {makes && makes.map(make => (
                          <option key={make._id} value={make._id}>
                            {CapitalizeNames(make.name)}
                          </option>
                        ))}
                      </TextField>
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
                  <Box mt={2} display='flex' 
                  justifyContent="flex-end">
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
                        {t("BreadCumbs.Create")}{t("Vehicles.Vehicle")}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

VehicleCreateForm.propTypes = {
  className: PropTypes.string
};

export default VehicleCreateForm;
