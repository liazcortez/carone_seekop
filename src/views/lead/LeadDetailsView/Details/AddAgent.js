import React, {  useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { Formik } from 'formik';
import clsx from 'clsx';  
import useUser from 'src/hooks/useUser';
import useAuth from 'src/hooks/useAuth';
import useLead from 'src/hooks/useLead';
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
    User as EditIcon
  } from 'react-feather';
  
  const useStyles = makeStyles((theme) => ({
    root: {},
    cell: {
      padding: theme.spacing(1)
    }
  }));
  
  const AddAgent = ({ className, ...rest }) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();  
    const { getUsersByStore, users } = useUser();
    const { updateLead, lead } = useLead();
    const { user } = useAuth();
    const route = useParams();
 
    useEffect(() => {
      if(lead.store !== undefined){
        getUsersByStore(lead.store._id)
        
      }

      // eslint-disable-next-line
    }, [lead])
    
    return (
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <CardHeader title="Agent" />
        <Divider />
        <CardContent>
        <Formik
          enableReinitialize
          initialValues={{
            agent: lead && lead.agent && lead.agent._id ? lead.agent._id : ''
          }}
          onSubmit={async (values, {
            resetForm,
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            try {
              await updateLead(values, route.id);
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              enqueueSnackbar('Agent assigned', {
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
                    name="agent"
                    onChange={handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={values.agent}                  
                    variant="outlined"
                    >
                    <option key={0} value={''}></option>
                    {users.map((us) => (
                      us.name !== user.name && us.role !== 'admin' && us.role !== 'rockstar' ?
                        (<option
                        key={us._id}
                        value={us._id}
                        >
                        {us && us.name.charAt(0).toUpperCase() + us.name.slice(1)}
                        </option>) : false
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
                        {lead && lead.agent ? 'Assigned' : 'Assign Agent'}
                    </Button>
                </Box>
            </form>
          )}
        </Formik>
        </CardContent>
      </Card>
    );
  };
  
  AddAgent.propTypes = {
    className: PropTypes.string,
  };
  
  export default AddAgent;
  