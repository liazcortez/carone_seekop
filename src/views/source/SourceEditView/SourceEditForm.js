import React, {useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import useSource from 'src/hooks/useSource';
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

const SourceEditForm = ({
  className,
  source,
  ...rest
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { updateSource, error, loading } = useSource();
  const history = useHistory();
  const [submitedForm, setSubmitedForm] = useState(false);
  const { t } = useTranslation()
  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar(t("SnackBar.SourceUpdated"), {
          variant: 'success'
        });
        history.push(`/app/management/sources/${source.id}`);
      }
      setSubmitedForm(false)
    }

    // eslint-disable-next-line
  }, [submitedForm]);

  return (
    <Formik
      initialValues={{
        name: (source && CapitalizeNames(source.name)) || '',
        description: (source && Capitalize(source.description)) || '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255),
        description: Yup.string().max(255)
      })}
      onSubmit={async (values, {
        resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          await updateSource(values, source._id);
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
            <CardHeader title={t("Titles.EditSource")} />
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
                        color="secondary"
                        disabled={isSubmitting}
                        type="submit"
                        variant="contained"
                      >
                        {t("Buttons.Update")} {t("Sources.Source")}
                      </Button>
                    )}
              </Box>
            </CardContent>
          </Card>
        </form>
      )}
    </Formik>
  );
};

SourceEditForm.propTypes = {
  className: PropTypes.string,
  source: PropTypes.object.isRequired
};

export default SourceEditForm;
