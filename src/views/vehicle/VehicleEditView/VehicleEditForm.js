import React, {useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import useVehicle from 'src/hooks/useVehicle';
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
  FormHelperText,
  Divider,
  CardHeader
} from '@material-ui/core';

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
  const { updateVehicle, error } = useVehicle();
  const history = useHistory();
  const [submitedForm, setSubmitedForm] = useState(false);

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar('Vehicle updated', {
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
        model: vehicle.model || '',
        description: vehicle.description || '',
        year: vehicle.year || '',
        price: vehicle.price || '',
        serie: vehicle.serie || '',
        key: vehicle.key || '',
        color: vehicle.color || '',
        inventory: vehicle.inventory|| '',
        modeDescription: vehicle.modeDescription || '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        model: Yup.string().max(255),
        description: Yup.string().max(255),
        year: Yup.number(),
        price: Yup.number()
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
          <CardHeader title="Vehicle" />
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
                    label="Model"
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
                    label="Description"
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
                    error={Boolean(touched.modeDescription && errors.modeDescription)}
                    fullWidth
                    helperText={touched.modeDescription && errors.modeDescription}
                    label="Mode Description"
                    name="modeDescription"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.modeDescription}
                    variant="outlined"
                    
                  />
                </Grid>  
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.year && errors.year)}
                    fullWidth
                    helperText={touched.year && errors.year}
                    label="Year"
                    name="year"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.year}
                    variant="outlined"
                    
                  />
                </Grid>  
                <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.serie && errors.serie)}
                        fullWidth
                        helperText={touched.serie && errors.serie}
                        label="Serie"
                        name="serie"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.serie}
                        variant="outlined"
                      />
                    </Grid>      
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.key && errors.key)}
                        fullWidth
                        helperText={touched.key && errors.key}
                        label="Key"
                        name="key"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.key}
                        variant="outlined"
                      />
                    </Grid>      
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.color && errors.color)}
                        fullWidth
                        helperText={touched.color && errors.color}
                        label="Color"
                        name="color"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.color}
                        variant="outlined"
                      />
                    </Grid>      
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.inventory && errors.inventory)}
                        fullWidth
                        helperText={touched.inventory && errors.inventory}
                        label="Inventory"
                        name="inventory"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.inventory}
                        variant="outlined"
                      />
                    </Grid>  
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.price && errors.price)}
                    fullWidth
                    helperText={touched.price && errors.price}
                    label="Price"
                    name="price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.price}
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
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Update Vehicle
                </Button>
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
