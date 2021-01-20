import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import ProfileDetails from '../../account/AccountView/General/ProfileDetails';
import useAuth from 'src/hooks/useAuth';
import useUser from 'src/hooks/useUser';
import { useHistory } from 'react-router-dom';
import AlertP from 'src/components/Alert';
import useStore from 'src/hooks/useStore';
import { CapitalizeNames } from 'src/utils/capitalize';
import Spinner from 'src/components/Spinner';

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

const roleOptions = [{
    id: 1,
    value: 'user'
  },{
    id: 2,
    value: 'admin'
  },{
    id: 3,
    value: 'super admin'
  },{
    id: 4,
    value: 'rockstar'
  }]

const UserCreateForm = ({
  className,
  ...rest
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();  
  const { user } = useAuth();
  const { createUser, error, loading, clearState } = useUser();
  const { getStores, stores } = useStore();
  const history = useHistory();
  const [submitedForm, setSubmitedForm] = useState(false);
  const { t } = useTranslation()

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar(t("SnackBar.UserCreated"), {
          variant: 'success'
        });
        history.push('/app/management/users');
      }
      setSubmitedForm(false)
    }

    // eslint-disable-next-line
  }, [submitedForm]);

  useEffect(()=>{
    getStores();
    clearState()
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
            name: '',
            email: '',
            password: '',
            password2: '',
            role: null,
            store: '',
            submit: null

          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(255),
            email: Yup.string().email(t("Yup.Email")).max(255).required(t("Yup.EmailReq")),

          })}
          onSubmit={async (values, {
            resetForm,
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            try {
              
              if(values.password === values.password2){
                await createUser(values);
                setSubmitedForm(true);
              }else{
                setErrors({ submit: t("Errors.Passwords") });
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
                <CardHeader title={t("Titles.CreateUser")} />
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
                        label={t("Users.Name")}
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
                        error={Boolean(touched.email && errors.email)}
                        fullWidth
                        label={t("Users.Email")}
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.email}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.password && errors.password)}
                        fullWidth
                        helperText={touched.password && errors.password}
                        label={t("Users.Password1")}
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.password}
                        variant="outlined"
                        type="password"

                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.password2 && errors.password2)}
                        fullWidth
                        helperText={touched.password2 && errors.password2}
                        label={t("Users.Password2")}
                        name="password2"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        type="password"
                      />
                        
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
                        label={t("Users.Store")}
                        name="store"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        select
                        required
                        variant="outlined"
                        SelectProps={{ native: true }}

                      >
                          <option key={0} value={''}>
                          </option>

                        {stores && stores.map(store => (
                          <option key={store._id} value={store._id}>
                            {CapitalizeNames(store.make.name) + " "+ CapitalizeNames(store.name)}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.role && errors.role)}
                        fullWidth
                        helperText={touched.role && errors.role}
                        label={t("Users.Role")}
                        name="role"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        select
                        variant="outlined"
                        SelectProps={{ native: true }}

                      >
                          <option key={0} value={''}>
                          </option>

                        {roleOptions.map(role => (
                          <option key={role.id} value={role.value}>
                            {CapitalizeNames(role.value)}
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
                   { loading ? 
                    (
                      <>
                          <Typography style={{marginTop: 10}} variant='h5'>{t("Buttons.Creating")}</Typography><Spinner style={{paddingRight: 10}} width={45}/>
                      </>
                    ) : 
                    (
                      <Button
                        color="secondary"
                        disabled={isSubmitting}
                        type="submit"
                        variant="contained"
                      >
                        {t("BreadCumbs.Create")}{t("Users.User")}
                      </Button>
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

UserCreateForm.propTypes = {
  className: PropTypes.string
};

export default UserCreateForm;
