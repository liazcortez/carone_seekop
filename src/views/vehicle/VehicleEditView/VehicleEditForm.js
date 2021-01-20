import React, {useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import useVehicle from 'src/hooks/useVehicle';
import { useHistory } from 'react-router-dom';
import AlertP from 'src/components/Alert';
import Spinner from 'src/components/Spinner';
import { CapitalizeNames, Capitalize } from 'src/utils/capitalize';

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  makeStyles,
  FormHelperText,
  Divider,
  CardHeader,
  Typography
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  root: {}
}));

const VehicleEditForm = ({
  className,
  vehicle,
  ...rest
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { updateVehicle, error, loading } = useVehicle();
  const history = useHistory();
  const [submitedForm, setSubmitedForm] = useState(false);
  const { t } = useTranslation()

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar(t("SnackBar.VehicleUpdated"), {
          variant: 'success'
        });
        history.push(`/app/management/vehicles/${vehicle.id}`);
      }
      setSubmitedForm(false)
    }

    // eslint-disable-next-line
  }, [submitedForm]);

  return (
    <Formik
      initialValues={{
        model: CapitalizeNames(vehicle.model) || '',
        description: Capitalize(vehicle.description) || '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        model: Yup.string().max(255),
        description: Yup.string().max(255),
      })}
      onSubmit={async (values, {
        resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          await updateVehicle(values, vehicle._id);
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
          <CardHeader title={t("Vehicles.Vehicle")} />
            <Divider />
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
                    label={t("Vehicles.Model")}
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
                    label={t("Vehicles.Description")}
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
              <Box  mt={2}
                  display="flex"
                  justifyContent="flex-end">
                { loading ? 
                    (
                      <>
                          <Typography style={{marginTop: 10}} variant='h5'>{t("Buttons.Updating")}</Typography><Spinner style={{paddingRight: 10}} width={45}/>
                      </>
                    ) : 
                    (
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {t("Buttons.Update")} {t("Vehicles.Vehicle")}
                    </Button>
                )
                }
              </Box>
            </CardContent>
          </Card>
        </form>
      )}
    </Formik>
  );
};

VehicleEditForm.propTypes = {
  className: PropTypes.string,
  vehicle: PropTypes.object.isRequired
};

export default VehicleEditForm;
