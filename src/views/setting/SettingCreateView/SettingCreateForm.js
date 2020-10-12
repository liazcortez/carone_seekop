import React, { useEffect, useState, useRef }  from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import ProfileDetails from '../../account/AccountView/General/ProfileDetails';
import useAuth from 'src/hooks/useAuth';
import useSetting from 'src/hooks/useSetting';
import { useHistory } from 'react-router-dom';
import AlertP from 'src/components/Alert';
import useStore from 'src/hooks/useStore';

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

const useStyles = makeStyles(() => ({
  root: {}
}));

const SettingCreateForm = ({
  className,
  ...rest
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();  
  const { user } = useAuth();
  const { createSetting, error, loading } = useSetting();
  const inputFile = useRef(null) 
  const history = useHistory();
  const { stores, getStores } = useStore();
  const [submitedForm, setSubmitedForm] = useState(false);


  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar('Setting created', {
          variant: 'success'
        });
        history.push('/app/management/settings');
      }
      setSubmitedForm(false)
    }

    // eslint-disable-next-line
  }, [submitedForm]);


  useEffect(() => {
    getStores();
    // eslint-disable-next-line
  }, []);

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
            coldT: '',
            coldP: '',
            warmT: '',
            warmP: '',
            hotT: '',
            hotP: '',
            store: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            coldT: Yup.number(),
            coldP: Yup.number(),
            warmT: Yup.number(),
            warmP: Yup.number(),
            hotT: Yup.number(),
            hotP: Yup.number(),
          })}
          onSubmit={async (values, {
            resetForm,
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            try {
              await createSetting({
                cold: {
                  time: values.coldT,
                  downPayment: values.coldP
                },
                warm: {
                  time: values.warmT,
                  downPayment: values.warmP
                },
                hot: {
                  time: values.hotT,
                  downPayment: values.hotP
                },
                store: values.store
              });
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
                <CardHeader title="Create Setting" />
                <CardHeader title="Cold" />
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
                        error={Boolean(touched.coldT && errors.coldT)}
                        fullWidth
                        helperText={touched.coldT && errors.coldT}
                        label="+ Months"
                        name="coldT"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.coldT}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.coldP && errors.coldP)}
                        fullWidth
                        helperText={touched.coldP && errors.coldP}
                        label="- Down Payment"
                        name="coldP"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.coldP}
                        variant="outlined"
                      />
                    </Grid>
                    </Grid>
                
                </CardContent>

                <CardHeader title="Warm" />
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
                        error={Boolean(touched.warmT && errors.warmT)}
                        fullWidth
                        helperText={touched.warmT && errors.warmT}
                        label="- Months"
                        name="warmT"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.warmT}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.warmP && errors.warmP)}
                        fullWidth
                        helperText={touched.warmP && errors.warmP}
                        label="- Down Payment"
                        name="warmP"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.warmP}
                        variant="outlined"
                      />
                    </Grid>
                    </Grid>
                </CardContent>

                <CardHeader title="Hot" />
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
                        error={Boolean(touched.hotT && errors.hotT)}
                        fullWidth
                        helperText={touched.hotT && errors.hotT}
                        label="- Months"
                        name="hotT"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.hotT}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.hotP && errors.hotP)}
                        fullWidth
                        helperText={touched.hotP && errors.hotP}
                        label="+ Down Payment"
                        name="hotP"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.hotP}
                        variant="outlined"
                      />
                    </Grid>
                    </Grid>
                  </CardContent>
                    <CardHeader title="Store" />
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
                      fullWidth
                      name="store"
                      onChange={handleChange}
                      select
                      required
                      variant="outlined"
                      SelectProps={{ native: true }}
                      >
                        <option key={0} value={''}></option>
                         {stores && stores.map(store => (
                            <option key={store._id} value={store._id}>
                            {store.make && store.make.name.charAt(0).toUpperCase() + store.make.name.slice(1) + ' ' +  store.name.charAt(0).toUpperCase() + store.name.slice(1)}
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
                    Create Lead
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

SettingCreateForm.propTypes = {
  className: PropTypes.string
};

export default SettingCreateForm;

