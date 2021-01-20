import React, {  useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { Formik } from 'formik';
import clsx from 'clsx';  
import useOmsGlobal from 'src/hooks/useOmsGlobal';
import { useParams } from 'react-router';
import useStatus from 'src/hooks/useStatus';
import useAuth from 'src/hooks/useAuth';
import { CapitalizeNames } from 'src/utils/capitalize';
import { useTranslation } from 'react-i18next';
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
  
  const StatusLead = ({ className, ...rest }) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();  
    const { statuses, getStatuses } = useStatus();
    const { updateOmsGlobalStatus, omsGlobal, getOmsGlobal } = useOmsGlobal();
    const { t } = useTranslation();
    const { user } = useAuth();
    const route = useParams();
    useEffect(() => {
      getOmsGlobal(route.id)
      getStatuses();
      // eslint-disable-next-line
    }, [])
    
    return (
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <CardHeader title={t("Leads.Status")} />
        <Divider />
        <CardContent>
        <Formik
          enableReinitialize
          initialValues={{
            id: rest.lead,
            status: omsGlobal && omsGlobal.status && omsGlobal.status._id
          }}
          onSubmit={async (values, {
            resetForm,
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            try {
              await updateOmsGlobalStatus(values);
              await getOmsGlobal(values.id)
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              enqueueSnackbar(t("SnackBar.StatusUpdated"), {
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
                    name='status'
                    onChange={handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={values.status}                  
                    variant="outlined"
                    >
                    {statuses.map((status) => (
                      status.name !== 'default' && status.name !== 'new' ?
                        (<option
                        key={status._id}
                        value={status._id}
                        >
                        {status && CapitalizeNames(status.name)}
                        </option>) : 
                        status.name === "new" && user.role !== 'user' ? 
                        (<option
                          key={status._id}
                          value={status._id}
                          >
                          {status && CapitalizeNames(status.name)}
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
                        {t("Buttons.Update")}{t("Leads.Status")}
                    </Button>
                </Box>
            </form>
          )}
        </Formik>
        </CardContent>
      </Card>
    );
  };
  
  StatusLead.propTypes = {
    className: PropTypes.string,
  };
  
  export default StatusLead;
  