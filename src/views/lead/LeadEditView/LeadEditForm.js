import React, {useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import useLead from 'src/hooks/useLead';
import { useHistory } from 'react-router-dom';
import AlertP from 'src/components/Alert';
import { DateTimePicker } from '@material-ui/pickers';
import useVehicle from 'src/hooks/useVehicle';
import useSource from 'src/hooks/useSource';
import { useParams } from 'react-router';
import useCompany from 'src/hooks/useCompany';
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
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

const LeadEditForm = ({
  className,
  lead,
  ...rest
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { updateLead, error, getLeads } = useLead();
  const { getVehicles, vehicles } = useVehicle();
  const { getSources, sources } = useSource();
  const { getCompanies, companies } = useCompany();
  const history = useHistory();
  const [submitedForm, setSubmitedForm] = useState(false);
  const route = useParams();

  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar('Lead updated', {
          variant: 'success'
        });
        history.push(`/app/management/leads/${lead._id}`);
      }
      setSubmitedForm(false)
    }

    // eslint-disable-next-line
  }, [submitedForm]);

  useEffect(() => {
   
    getLeads();
    getSources();
    getVehicles();
    getCompanies();
    // eslint-disable-next-line
  }, [])

  return (
    <Formik
          enableReinitialize
          initialValues={{
            vehicle: (lead && lead.vehicle && lead.vehicle._id) || '',
            source: (lead && lead.source && lead.source._id)|| '',
            downPayment: (lead && lead.downPayment)|| '',
            timeFrame: (lead && lead.timeFrame )|| '',

            name: lead.name || '',
            email: lead.email || '',
            apPaterno: lead.apPaterno|| '',
            apMaterno: lead.apMaterno|| '',
            phone: lead.phone|| '',
            phone2: lead.phone2|| '',
            statusLead: lead.statusLead|| '',
            company:( lead && lead.company && lead.company._id)|| '',

            faauDate: lead.faauDate|| '',
            faauReason: lead.faauReason|| '',
            faauDeliveryDate: lead.faauDeliveryDate|| '',
            faauTotal: lead.faauTotal|| '',
            methodPayment: lead.methodPayment|| '',
            faauColony: lead.faauColony|| '',
            municipyName: lead.municipyName|| '',
            stateName: lead.stateName|| '',

            seller: lead.seller|| '',
            submit: null

          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(255),
            apPaterno: Yup.string().max(255),
            apMaterno: Yup.string().max(255),
            phone: Yup.number(),
            phone2: Yup.number(),

            faauTotal: Yup.number(),
            methodPayment: Yup.string().max(255),
            faauColony: Yup.string().max(255),
            municipyName: Yup.string().max(255),
            stateName: Yup.string().max(255),

            seller: Yup.string().max(255),
            faauReason: Yup.string().max(255),

            email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          })}
          onSubmit={async (values, {
            resetForm,
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            try {
              
              await updateLead(values, lead._id);
              setSubmitedForm(true);



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
            setFieldValue,
            setFieldTouched,
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
                <CardHeader title="Client" />
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
                        error={Boolean(touched.apPaterno && errors.apPaterno)}
                        fullWidth
                        helperText={touched.apPaterno && errors.apPaterno}
                        label="Last Name"
                        name="apPaterno"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.apPaterno}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.apMaterno && errors.apMaterno)}
                        fullWidth
                        helperText={touched.apMaterno && errors.apMaterno}
                        label="Last Name"
                        name="apMaterno"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.apMaterno}
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
                        label="Email"
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
                        error={Boolean(touched.phone && errors.phone)}
                        fullWidth
                        helperText={touched.phone && errors.phone}
                        label="Phone"
                        name="phone"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.phone}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.phone2 && errors.phone2)}
                        fullWidth
                        helperText={touched.phone2 && errors.phone2}
                        label="Phone"
                        name="phone2"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.phone2}
                        variant="outlined"
                      />
                    </Grid>
                    </Grid>
                
                </CardContent>

                <CardHeader title="Company" />
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
                        error={Boolean(touched.company && errors.company)}
                        fullWidth
                        helperText={touched.company && errors.company}
                        label="Company"
                        name="company"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        select
                        required
                        variant="outlined"
                        SelectProps={{ native: true }}
                        value={values.company}

                      >
                          <option key={0} value={''}>
                          </option>

                        {companies && companies.map(company => (
                          <option key={company._id} value={company._id}>
                            {company.name}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    </Grid>
                    </CardContent>

                <CardHeader title="Invoice" />
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
                      <DateTimePicker
                        error={Boolean(touched.faauDate && errors.faauDate)}
                        onBlur={handleBlur}
                        helperText={touched.faauDate && errors.faauDate}
                        fullWidth
                        required
                        inputVariant="outlined"
                        label="Date"
                        name="faauDate"
                        onClick={() => setFieldTouched('end')}
                        onChange={(date) => {
                          setFieldValue('faauDate', date)
                        }}
                        value={values.faauDate}
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.faauReason && errors.faauReason)}
                        fullWidth
                        helperText={touched.faauReason && errors.faauReason}
                        label="Reason"
                        name="faauReason"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.faauReason}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <DateTimePicker
                        error={Boolean(touched.faauDeliveryDate && errors.faauDeliveryDate)}
                        onBlur={handleBlur}
                        helperText={touched.faauDeliveryDate && errors.faauDeliveryDate}
                        fullWidth
                        required
                        inputVariant="outlined"
                        label="Delivery Date"
                        name="faauDeliveryDate"
                        onClick={() => setFieldTouched('end')}
                        onChange={(date) => {
                          setFieldValue('faauDeliveryDate', date)
                        }}
                        value={values.faauDeliveryDate}
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.faauTotal && errors.faauTotal)}
                        fullWidth
                        helperText={touched.faauTotal && errors.faauTotal}
                        label="Total"
                        name="faauTotal"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.faauTotal}
                        variant="outlined"
                        value={values.faauTotal}

                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.methodPayment && errors.methodPayment)}
                        fullWidth
                        helperText={touched.methodPayment && errors.methodPayment}
                        label="Payment Method"
                        name="methodPayment"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.methodPayment}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.faauColony && errors.faauColony)}
                        fullWidth
                        helperText={touched.faauColony && errors.faauColony}
                        label="Colony"
                        name="faauColony"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.faauColony}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.municipyName && errors.municipyName)}
                        fullWidth
                        helperText={touched.municipyName && errors.municipyName}
                        label="Municipy"
                        name="municipyName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.municipyName}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.stateName && errors.stateName)}
                        fullWidth
                        helperText={touched.stateName && errors.stateName}
                        label="State"
                        name="stateName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.stateName}
                        variant="outlined"
                      />
                    </Grid>
                    </Grid>
                    </CardContent>

                    <CardHeader title="Model" />
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
                        error={Boolean(touched.vehicle && errors.vehicle)}
                        fullWidth
                        helperText={touched.vehicle && errors.vehicle}
                        label="Model"
                        name="vehicle"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        select
                        required
                        variant="outlined"
                        SelectProps={{ native: true }}
                        value={values.vehicle}

                      >
                          <option key={0} value={''}>
                          </option>

                        {vehicles && vehicles.map(vehicle => (
                          <option key={vehicle._id} value={vehicle._id}>
                            {vehicle.model}
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
                        error={Boolean(touched.downPayment && errors.downPayment)}
                        fullWidth
                        helperText={touched.downPayment && errors.downPayment}
                        label="DownPayment"
                        name="downPayment"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        SelectProps={{ native: true }}
                        value={values.downPayment}

                      />
                         
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <DateTimePicker
                        error={Boolean(touched.timeFrame && errors.timeFrame)}
                        onBlur={handleBlur}
                        helperText={touched.timeFrame && errors.timeFrame}
                        fullWidth
                        required
                        inputVariant="outlined"
                        label="Time Frame"
                        name="timeFrame"
                        onClick={() => setFieldTouched('end')}
                        onChange={(date) => {
                          setFieldValue('timeFrame', date)
                        }}
                        value={values.timeFrame}
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.source && errors.source)}
                        fullWidth
                        helperText={touched.source && errors.source}
                        label="Source"
                        name="source"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        select
                        required
                        variant="outlined"
                        SelectProps={{ native: true }}
                        value={values.source}

                      >
                          <option key={0} value={''}>
                          </option>

                        {sources && sources.map(source => (
                          <option key={source._id} value={source._id}>
                            {source.name}
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
                        error={Boolean(touched.seller && errors.seller)}
                        fullWidth
                        helperText={touched.seller && errors.seller}
                        label="Seller"
                        name="seller"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        value={values.seller}

                      />
                         
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.statusLead && errors.statusLead)}
                        fullWidth
                        helperText={touched.statusLead && errors.statusLead}
                        label="Status"
                        name="statusLead"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        select
                        SelectProps={{ native: true }}
                        value={values.statusLead}
                      >
                        <option value={'new'} key={0}>New</option>
                        <option value={'preowned'} key={1}>Preowned</option>
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
                    Update Lead
                  </Button>
                </Box>
              </Card>
            </form>
          )}
        </Formik>
  );
};

LeadEditForm.propTypes = {
  className: PropTypes.string,
};

export default LeadEditForm;
