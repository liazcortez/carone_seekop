import React, {useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import useDocument from 'src/hooks/useDocument';
import { useHistory } from 'react-router-dom';
import AlertP from 'src/components/Alert';
import useStore from 'src/hooks/useStore';
import FilesDropzone from '../FilesDropzone';
import { CapitalizeNames } from 'src/utils/capitalize';
import Spinner from 'src/components/Spinner';
import StoreContext from 'src/contexts/store/storeContext'

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
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  root: {}
}));

const DocumentEditForm = ({
  className,
  document,
  ...rest
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { updateDocument, error, loading } = useDocument();
  const { stores, getStores } = useStore();
  const history = useHistory();
  const [submitedForm, setSubmitedForm] = useState(false);
  const [attachments, setAttachment] = useState(null);
  const { t } = useTranslation()
  const storeContext = useContext(StoreContext);

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar(t("SnackBar.DocumentUpdated"), {
          variant: 'success'
        });
        history.push(`/app/management/documents/${document.id}`);
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
      initialValues={{
        title: CapitalizeNames(document.title) || '',
        store: (document.store && document.store._id) || '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        title: Yup.string().max(255),
      })}
      onSubmit={async (values, {
        resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          await updateDocument(values, document._id, attachments);
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
            <CardHeader title={t("Titles.EditDocument")} />
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
                    error={Boolean(touched.title && errors.title)}
                    fullWidth
                    helperText={touched.title && errors.title}
                    label={t("Documents.Title")}
                    name="title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.title}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6} md={6}>
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
                        {store.make && CapitalizeNames(store.make.name) + ' ' +  CapitalizeNames(store.name)}
                        </option>
                    ))}
                </TextField>
                </Grid>  
                <Grid
                      item
                      md={12}
                      xs={12}
                    >
                      <FilesDropzone setAttachment={setAttachment}/>

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
                     {
                      storeContext.loading ? (
                        <>
                        <Typography style={{marginTop: 10}} variant='h5'>{t("Buttons.LoadingInfo")}</Typography><Spinner style={{paddingRight: 10}} width={45}/>
                        </>

                        ) : (
                        loading ?
                        ( 
                          <>
                            <Typography style={{marginTop: 10}} variant='h5'>{t("Buttons.Updating")}</Typography><Spinner style={{paddingRight: 10}} width={45}/>
                          </>
                        ) : (
                          <Button
                            variant="contained"
                            color="secondary"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            {t("Buttons.Update")} {t("Documents.Document")}
                          </Button> 
                        )
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

DocumentEditForm.propTypes = {
  className: PropTypes.string,
  document: PropTypes.object.isRequired
};

export default DocumentEditForm;
