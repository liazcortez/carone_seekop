import React, {useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import useMake from 'src/hooks/useMake';
import{ CapitalizeNames, Capitalize } from 'src/utils/capitalize';
import { useHistory } from 'react-router-dom';
import AlertP from 'src/components/Alert';
import Spinner from 'src/components/Spinner';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
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

const MakeEditForm = ({
  className,
  make,
  ...rest
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { updateMake, error, loading } = useMake();
  const history = useHistory();
  const [submitedForm, setSubmitedForm] = useState(false);
  const { t } = useTranslation()

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar(t("SnackBar.MakeUpdated"), {
          variant: 'success'
        });
        history.push(`/app/management/makes/${make.id}`);
      }
      setSubmitedForm(false)
    }

    // eslint-disable-next-line
  }, [submitedForm]);

  return (
    <Formik
      initialValues={{
        name: CapitalizeNames(make.name) || '',
        description: Capitalize(make.description) || '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255),
        description: Yup.string().max(20)
      })}
      onSubmit={async (values, {
        resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          await updateMake(values, make._id);
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
            <CardHeader title={t("Makes.Make")} />
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
              </Grid>
              {error && <AlertP severity="error" msg={error.error}/>}

              {errors.submit && (
                    <Box mt={3}>
                      <FormHelperText error>
                        {errors.submit}
                      </FormHelperText>
                    </Box>
                  )}
              <Box  
                  mt={2}
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
                      {t("Buttons.Update")} {t("Makes.Make")}
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

MakeEditForm.propTypes = {
  className: PropTypes.string,
  make: PropTypes.object.isRequired
};

export default MakeEditForm;
