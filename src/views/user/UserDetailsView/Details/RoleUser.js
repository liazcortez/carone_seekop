import React, {  useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { Formik } from 'formik';
import clsx from 'clsx';  
import useUser from 'src/hooks/useUser';
import { useParams } from 'react-router';
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
  
  const useStyles = makeStyles((theme) => ({
    root: {},
    cell: {
      padding: theme.spacing(1)
    }
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
  
  const RoleUser = ({ className, ...rest }) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();  
    const { updateUserRole, user, getUser } = useUser();
    const route = useParams();

    useEffect(() => {
      getUser(route.id)
      // eslint-disable-next-line
    }, [])
    
    return (
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <CardHeader title="Role" />
        <Divider />
        <CardContent>
        <Formik
          enableReinitialize
          initialValues={{
            id: rest.user,
            role: user && user.role 
          }}
          onSubmit={async (values, {
            resetForm,
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            try {
              await updateUserRole(values);
              await getUser(values.id)
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              enqueueSnackbar('Role updated', {
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
                    name="role"
                    onChange={handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={values.role}                  
                    variant="outlined"
                  >

                        {roleOptions.map(role => (
                          <option key={role.id} value={role.value}>
                            {role.value.charAt(0).toUpperCase() + role.value.slice(1)}
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
                        Update Role
                    </Button>
                </Box>
            </form>
          )}
        </Formik>
        </CardContent>
      </Card>
    );
  };
  
  RoleUser.propTypes = {
    className: PropTypes.string,
  };
  
  export default RoleUser;
  