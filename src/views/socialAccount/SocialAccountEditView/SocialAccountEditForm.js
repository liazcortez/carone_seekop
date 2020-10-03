import React, {useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
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
  FormHelperText,
  Divider,
  CardHeader
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

const SocialAccountEditForm = ({
  className,
  socialAccount,
  ...rest
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { updateSocialAccount, error } = useSocialAccount();
  const history = useHistory();
  const [submitedForm, setSubmitedForm] = useState(false);
  const { getStores } = useStore();

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar('Social Account updated', {
          variant: 'success'
        });
        history.push(`/app/management/socialAccounts/${socialAccount.id}`);
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
        name: socialAccount.name || '',
        account: socialAccount.account || '',
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
          await updateSocialAccount(values, socialAccount._id);
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
            <CardHeader title="Social Account" />
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
                    label="Account"
                    name="account"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.account}
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
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Update Social Account
                </Button>
              </Box>
            </CardContent>
          </Card>
        </form>
      )}
    </Formik>
  );
};

SocialAccountEditForm.propTypes = {
  className: PropTypes.string,
  socialAccount: PropTypes.object.isRequired
};

export default SocialAccountEditForm;
