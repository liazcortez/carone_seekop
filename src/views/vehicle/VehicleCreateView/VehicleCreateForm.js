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
import useMake from 'src/hooks/useMake';
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

} from '@material-ui/core';

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
  const { createVehicle, error } = useVehicle();
  const history = useHistory();
  const { makes, getMakes } = useMake();
  const [submitedForm, setSubmitedForm] = useState(false);

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar('Vehicle created', {
          variant: 'success'
        });
        history.push('/app/management/vehicles');
      }
      setSubmitedForm(false)
    }

    // eslint-disable-next-line
  }, [submitedForm]);

  useEffect(() => {
    
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
            year: '',
            make: '',
            price: '',
            user: user._id,
            serie: '',
            key: '',
            color: '',
            inventory: '',
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
                        error={Boolean(touched.modelType && errors.modelType)}
                        fullWidth
                        helperText={touched.modelType && errors.modelType}
                        label="Model Type"
                        name="modelType"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.modelType}
                        variant="outlined"
                        select
                        SelectProps={{ native: true }}

                      >
                        <option key={0} value={'option.value'}>
                        </option>
                        {modelTypeOptions && modelTypeOptions.map(option => (
                            <option key={option.id} value={option.value}>
                              {option.value.charAt(0).toUpperCase() + option.value.slice(1)}
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
                        error={Boolean(touched.year && errors.year)}
                        fullWidth
                        helperText={touched.year && errors.year}
                        label="Year"
                        name="year"
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                        error={Boolean(touched.make && errors.make)}
                        fullWidth
                        helperText={touched.make && errors.make}
                        name="make"
                        label='Make'
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
                            {make.name}
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
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Create Vehicle
                    </Button>
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
