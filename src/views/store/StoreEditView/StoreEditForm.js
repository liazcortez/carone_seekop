import React, {useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import useStore from 'src/hooks/useStore';
import { useHistory } from 'react-router-dom';
import AlertP from 'src/components/Alert';
import Spinner from 'src/components/Spinner';

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Divider,
  CardHeader,
  makeStyles,
  FormHelperText,
  Typography

} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { CapitalizeNames, Capitalize } from 'src/utils/capitalize';

const useStyles = makeStyles(() => ({
  root: {}
}));

const StoreEditForm = ({
  className,
  store,
  ...rest
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { updateStore, error, loading } = useStore();
  const history = useHistory();
  const [submitedForm, setSubmitedForm] = useState(false);
  const { t } = useTranslation()

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar(t("SnackBar.StoreUpdated"), {
          variant: 'success'
        });
        history.push(`/app/management/stores/${store.id}`);
      }
      setSubmitedForm(false)
    }

    // eslint-disable-next-line
  }, [submitedForm]);

  return (
    <Formik
      initialValues={{
        name: CapitalizeNames(store.name) || '',
        description: Capitalize(store.description) || '',
        address: CapitalizeNames(store.address) || '',
        phone: store.phone || '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255),
        description: Yup.string().max(255),
        address: Yup.string().max(255),
        phone: Yup.number().typeError(t("Yup.Number")),
      })}
      onSubmit={async (values, {
        resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          await updateStore(values, store._id);
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
            <CardHeader title={t("Titles.EditStore")} />
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
                      {t("Buttons.Update")} {t("Stores.Store")}
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

StoreEditForm.propTypes = {
  className: PropTypes.string,
  store: PropTypes.object.isRequired
};

export default StoreEditForm;
