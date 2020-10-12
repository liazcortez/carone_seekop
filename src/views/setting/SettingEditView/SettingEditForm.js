import React, {useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
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
  FormHelperText,
  Divider,
  CardHeader,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

const SettingEditForm = ({
  className,
  setting,
  ...rest
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { updateSetting, error, loading } = useSetting();
  const { stores, getStores } = useStore();
  const history = useHistory();
  const [submitedForm, setSubmitedForm] = useState(false);


  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar('Setting updated', {
          variant: 'success'
        });
        history.push(`/app/management/settings/${setting.id}`);
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
    <Formik
          enableReinitialize
          initialValues={{
            coldT: (setting.cold && setting.cold.time) || '',
            coldP: (setting.cold && setting.cold.downPayment) || '',
            warmT: (setting.warm && setting.warm.time) || '',
            warmP: (setting.warm && setting.warm.downPayment) || '',
            hotT: (setting.hot && setting.hot.time) || '',
            hotP: (setting.hot && setting.hot.downPayment) || '',
            store: (setting && setting.store && setting.store._id) || '',
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
              await updateSetting({
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
              }, setting._id);
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
                <CardHeader title="Update Setting" />
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
                      value={values.store}
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
                    Update Lead
                  </Button>
                </Box>
              </Card>
            </form>
          )}
        </Formik>
  );
};

SettingEditForm.propTypes = {
  className: PropTypes.string,
  setting: PropTypes.object.isRequired
};

export default SettingEditForm;
