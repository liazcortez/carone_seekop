import React, {  useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { Formik } from 'formik';
import clsx from 'clsx';  
import useUser from 'src/hooks/useUser';
import { CapitalizeNames } from 'src/utils/capitalize';
import { useParams } from 'react-router';
import useStore from 'src/hooks/useStore';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    TextField,
    FormHelperText,
    makeStyles,
  } from '@material-ui/core';
  import {
    Edit as EditIcon
  
  } from 'react-feather';
import { useTranslation } from 'react-i18next';
  
  const useStyles = makeStyles((theme) => ({
    root: {},
    cell: {
      padding: theme.spacing(1)
    }
  }));
  
  const UpdateStore = ({ className, ...rest }) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();  
    const { stores, getStores } = useStore();
    const { updateUser, user, getUser } = useUser();
    const route = useParams();
    const { t } = useTranslation()

    useEffect(() => {
      getUser(route.id)
      getStores();

      // eslint-disable-next-line
    }, [])
    
    return (
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <CardHeader title={t("Users.Store")} />
        <Divider />
        <CardContent>
        <Formik
          enableReinitialize
          initialValues={{
            store: user && user.store && user.store._id
          }}
          onSubmit={async (values, {
            resetForm,
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            try {
              await updateUser(values, route.id);
              await getUser(route.id)
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              enqueueSnackbar(t("SnackBar.StoreUpdated"), {
                variant: 'success'
              });
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
                <TextField
                    fullWidth
                    name="store"
                    onChange={handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={values.store}                  
                    variant="outlined"
                    >
                    {stores.map((store) => (
                        <option  key={store._id} value={store._id} >
                        {CapitalizeNames(store.make.name) + " " + CapitalizeNames(store.name)}
                        </option>
                    ))}
                </TextField>
                {errors.submit && (
                    <Box mt={3}>
                      <FormHelperText error>
                        {errors.submit}
                      </FormHelperText>
                    </Box>
                )}
                <Divider />
                <Box
                  mt={2}
                >
                    <Button
                        variant="contained"
                        type="submit"
                        size="large"
                        fullWidth
                        color="primary"
                        startIcon={<EditIcon />}
                        >
                        {t("Buttons.Update")} {t("Users.User")}
                    </Button>
                </Box>
            </form>
          )}
        </Formik>
        </CardContent>
      </Card>
    );
  };
  
  UpdateStore.propTypes = {
    className: PropTypes.string,
  };
  
  export default UpdateStore;
  