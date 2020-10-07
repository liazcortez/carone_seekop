import React, {useEffect, useState, useRef } from 'react';
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
import Spinner from 'src/components/Spinner';

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
  const inputFile = useRef(null) 
  const [submitedForm, setSubmitedForm] = useState(false);
  const [nameFile, setNameFile] = useState('');
  const [attachments, setAttachment] = useState(null);

  const fileChangeHandler = (e) =>{
    setAttachment(e.target.files[0]);
  }

  const handleAttach = () => {
    inputFile.current.click();
   };

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar('Document updated', {
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

  useEffect(() => {
    let name = '';
    if(document.file){
      name = document.file.split('/')
      setNameFile(name[name.length - 1])
    }
    // eslint-disable-next-line
  }, [document]);
  return (
    <Formik
      initialValues={{
        title: document.title || '',
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
            <CardHeader title="Document" />
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
                    label="Title"
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
                        {store.make && store.make.name.charAt(0).toUpperCase() + store.make.name.slice(1) + ' ' +  store.name.charAt(0).toUpperCase() + store.name.slice(1)}
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
                { loading ? 
                    (
                      <>
                          <Typography style={{marginTop: 10}} variant='h5'>Loading</Typography><Spinner style={{paddingRight: 10}} width={45}/>
                      </>
                    ) : 
                    (
                      <Button
                        color="secondary"
                        disabled={isSubmitting}
                        type="submit"
                        variant="contained"
                      >
                        Edit Document
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

DocumentEditForm.propTypes = {
  className: PropTypes.string,
  document: PropTypes.object.isRequired
};

export default DocumentEditForm;
