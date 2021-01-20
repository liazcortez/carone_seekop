import React, { useEffect, useState, useContext }  from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import ProfileDetails from '../../account/AccountView/General/ProfileDetails';
import useAuth from 'src/hooks/useAuth';
import useDocument from 'src/hooks/useDocument';
import { useHistory } from 'react-router-dom';
import AlertP from 'src/components/Alert';
import useStore from 'src/hooks/useStore';
import { CapitalizeNames } from 'src/utils/capitalize';
import FilesDropzone from '../FilesDropzone';
import Spinner from 'src/components/Spinner';
import useUtils from 'src/hooks/useUtils';
import StoreContext from 'src/contexts/store/storeContext'


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
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  root: {}
}));

const DocumentCreateForm = ({
  className,
  ...rest
}) => {
  const classes = useStyles();
  const { t } = useTranslation()
  const { uploadCsv } = useUtils();
  const { enqueueSnackbar } = useSnackbar();  
  const storeContext = useContext(StoreContext);
  const { user } = useAuth();
  const { createDocument, error, loading } = useDocument();
  const history = useHistory();
  const { stores, getStores } = useStore();
  const [submitedForm, setSubmitedForm] = useState(false);
  const [attachments, setAttachment] = useState(null);

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar(t("SnackBar.DocumentCreated"), {
          variant: 'success'
        });
        history.push('/app/management/documents');
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
            title: '',
            store: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(255)
          })}
          onSubmit={async (values, {
            resetForm,
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            try {
              if(attachments !== null){
                await createDocument(values, attachments);
                await uploadCsv(attachments)
                setSubmitedForm(true)
              }else{
                setErrors({submit: t('Errors.File')})
              }
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
                <CardHeader title={t("Titles.CreateDocument")} />
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
                    <Grid
                      item
                      md={6}
                      xs={12}
                      >
                    <TextField
                      fullWidth
                      label={t("Documents.Store")}
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
                </CardContent>
                <Divider />
                <Box
                  p={2}
                  display="flex"
                  justifyContent="flex-end"
                >

                  {storeContext.loading ? (
                    <>
                    <Typography style={{marginTop: 10}} variant='h5'>{t("Buttons.LoadingInfo")}</Typography><Spinner style={{paddingRight: 10}} width={45}/>
                    </>

                    ) : (
                    loading ?
                    ( 
                      <>
                        <Typography style={{marginTop: 10}} variant='h5'>{t("Buttons.Creating")}</Typography><Spinner style={{paddingRight: 10}} width={45}/>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                        disabled={isSubmitting}
                      >
                         {t("Titles.CreateDocument")} 
                      </Button> 
                    )
                  )}
                  
                </Box>
              </Card>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

DocumentCreateForm.propTypes = {
  className: PropTypes.string
};

export default DocumentCreateForm;
