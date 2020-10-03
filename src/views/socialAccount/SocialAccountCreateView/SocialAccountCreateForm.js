import React, { useEffect, useState }  from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import ProfileDetails from '../../account/AccountView/General/ProfileDetails';
import useAuth from 'src/hooks/useAuth';
import useSocialAccount from 'src/hooks/useSocialAccount';
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

} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));
const categories = ['Facebook Ads', 'Facebook Insights', 'Google Ads', 'Twitter', 'Instragram', 'Youtube'];

const SocialAccountCreateForm = ({
  className,
  ...rest
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();  
  const { user } = useAuth();
  const { createSocialAccount, error } = useSocialAccount();
  const history = useHistory();
  const [submitedForm, setSubmitedForm] = useState(false);
  const { stores, getStores } = useStore();

  useEffect(()=>{

    getStores();
    //eslint-disable-next-line
  },[])

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar('SocialAccount created', {
          variant: 'success'
        });
        history.push('/app/management/socialAccounts');
      }
      setSubmitedForm(false)
    }

    // eslint-disable-next-line
  }, [submitedForm]);

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
            name: '',
            account: '',
            category: '',
            store: '',
            user: user._id,
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
              await createSocialAccount(values);
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
                <CardHeader title="Create Social Account" />
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
                        error={Boolean(touched.name && errors.name)}
                        fullWidth
                        helperText={touched.name && errors.name}
                        label="Name"
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
                        error={Boolean(touched.account && errors.account)}
                        fullWidth
                        helperText={touched.account && errors.account}
                        name="account"
                        label="Account"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.account}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.category && errors.category)}
                        fullWidth
                        helperText={touched.category && errors.category}
                        label="Category"
                        name="category"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.category}
                        variant="outlined"
                        SelectProps={{ native: true }}
                        required
                        select
                      >
                        <option key={0} value={''}></option>
                        {
                          categories.map( category => 
                            (
                            <option key={category} value={category}>
                            {category}
                            </option>)
                          )
                        }
                      </TextField>
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.store && errors.store)}
                        fullWidth
                        helperText={touched.store && errors.store}
                        name="store"
                        label="Store"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.store}
                        variant="outlined"
                        SelectProps={{ native: true }}
                        select
                        required
                      >
                        <option key={0} value={''}></option>
                        {
                          stores && stores.map( store => 
                            (
                            <option key={store._id} value={store._id}>
                            {store && store.make.name.charAt(0).toUpperCase() + store.make.name.slice(1) + ' '+ store.name}
                            </option>)
                          )
                        }
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
                    Create Social Account
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

SocialAccountCreateForm.propTypes = {
  className: PropTypes.string
};

export default SocialAccountCreateForm;
