import React, {useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import useOmsGlobal from 'src/hooks/useOmsGlobal';
import { useHistory } from 'react-router-dom';
import AlertP from 'src/components/Alert';
import { DateTimePicker } from '@material-ui/pickers';
import useCompany from 'src/hooks/useCompany';
import useMake from 'src/hooks/useMake';
import useStore from 'src/hooks/useStore';
import useAuth from 'src/hooks/useAuth';
import { CapitalizeNames } from 'src/utils/capitalize';
import Spinner from 'src/components/Spinner';
import VehicleContext from 'src/contexts/vehicle/vehicleContext'
import StoreContext from 'src/contexts/store/storeContext'
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
  Typography
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

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
  const { updateOmsGlobal, error, loading } = useOmsGlobal();
  const { makes, getMakes } = useMake();
  const { stores, getStores, getStoresByMake } = useStore();
  const { user } = useAuth();
  const [disableInput, setDisableInput] = useState(false)
  const vehicleContext = useContext(VehicleContext);
  const [updating, seTUpdating] = useState(false)
  const storeContext = useContext(StoreContext);
  const { getCompanies, companies } = useCompany();
  const history = useHistory();
  const [submitedForm, setSubmitedForm] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar(t("SnackBar.LeadUpdated"), {
          variant: 'success'
        });
        history.push(`/app/management/omsLeads/${lead._id}`);
      }
      setSubmitedForm(false)
    }

    // eslint-disable-next-line
  }, [submitedForm]);

  useEffect(() => {
    getCompanies();
    getMakes();
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if(user && user.role && user.store && (user.role === 'admin' || user.role === 'user')){
      setDisableInput(true);
      getStoresByMake(user.store.make._id);
    }
    if(user && user.role && (user.role === 'rockstar' || user.role === 'super admin')){
      getStores();
    }
    // eslint-disable-next-line
  }, [user])

  return (
    <Formik
          enableReinitialize
          initialValues={{

            name: CapitalizeNames(lead.name) || '',
            email: CapitalizeNames(lead.email) || '',
            apPaterno: CapitalizeNames(lead.apPaterno) || '',
            apMaterno: CapitalizeNames(lead.apMaterno) || '',
            phone: lead && lead.phone && lead.phone.replace(/\+/g, "") !== 'na' ?  lead.phone.replace(/\+/g, "") : '',
            phone2: lead && lead.phone2 && lead.phone2.replace(/\+/g, "") !== 'na' ?  lead.phone2.replace(/\+/g, "") : '',
            // statusLead: lead.statusLead|| '',
            company:( lead && lead.company && lead.company._id)|| '',
            key: (lead && lead.key) || '',
            faauDate: lead.faauDate|| '',
            faauReason: CapitalizeNames(lead.faauReason)|| '',
            faauDeliveryDate: lead.faauDeliveryDate|| '',
            faauTotal: lead.faauTotal|| '',
            methodPayment: CapitalizeNames(lead.methodPayment)|| '',
            faauColony: CapitalizeNames(lead.faauColony)|| '',
            municipyName: CapitalizeNames(lead.municipyName)|| '',
            stateName: CapitalizeNames(lead.stateName)|| '',
            store: lead && lead.store && lead.store._id,
            modeType: CapitalizeNames(lead.modeType) || '',
            descModel: CapitalizeNames(lead.descModel) || '',
            modeDescription: CapitalizeNames(lead.modeDescription) || '',
            color: CapitalizeNames(lead.color) || '',
            year: CapitalizeNames(lead.year) || '',
            inventory: CapitalizeNames(lead.inventory) || '',
            serie: CapitalizeNames(lead.serie) || '',
            yearModel: CapitalizeNames(lead.yearModel) || '',

            seller: CapitalizeNames(lead.seller) || '',
            make: (lead && lead.make && lead.make._id),

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

            email: Yup.string(),
          })}
          onSubmit={async (values, {
            resetForm,
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            try {
              seTUpdating(true)
              await updateOmsGlobal(values, lead._id);
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
                <CardHeader title={t("OmsGlobals.Client")} />
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
                        label={t("OmsGlobals.Name")}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                        label={t("OmsGlobals.ApPaterno")}
                        name="apPaterno"
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                        label={t("OmsGlobals.ApMaterno")}
                        name="apMaterno"
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                        label={t("OmsGlobals.Email")}
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                        label={t("OmsGlobals.Phone")}
                        name="phone"
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                        label={t("OmsGlobals.Phone")}
                        name="phone2"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.phone2}
                        variant="outlined"
                      />
                    </Grid>
                    </Grid>
                
                </CardContent>

                <CardHeader title={t("Companies.Company")} />
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
                        label={t("Companies.Company")}
                        name="company"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        select
                        variant="outlined"
                        SelectProps={{ native: true }}
                        value={values.company}

                      >
                          <option key={0} value={''}>
                          </option>

                        {companies && companies.map(company => (
                          <option key={company._id} value={company._id}>
                            {CapitalizeNames(company.name)}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    </Grid>
                    </CardContent>

                <CardHeader title={t("Invoices.Invoice")} />
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
                        inputVariant="outlined"
                        label={t("OmsGlobals.Date")}
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
                        label={t("OmsGlobals.Reason")}
                        name="faauReason"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.faauReason}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.faauDeliveryDate && errors.faauDeliveryDate)}
                        fullWidth
                        helperText={touched.faauDeliveryDate && errors.faauDeliveryDate}
                        label={t("OmsGlobals.DDate")}
                        name="faauDeliveryDate"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.faauDeliveryDate}
                        variant="outlined"
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
                        label={t("OmsGlobals.Total")}
                        name="faauTotal"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.faauTotal}
                        variant="outlined"

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
                        label={t("OmsGlobals.Payment")}
                        name="methodPayment"
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                        label={t("OmsGlobals.Colony")}
                        name="faauColony"
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                        label={t("OmsGlobals.Municipy")}
                        name="municipyName"
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                        label={t("OmsGlobals.State")}
                        name="stateName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.stateName}
                        variant="outlined"
                      />
                    </Grid>
                    </Grid>
                    </CardContent>

                    <CardHeader title={t("Vehicles.Model")} />
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
                        error={Boolean(touched.make && errors.make)}
                        fullWidth
                        helperText={touched.make && errors.make}
                        name="make"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        disabled={disableInput}
                        select
                        SelectProps={{ native: true }}
                        value={values.make}

                      >
                        <option key={0} value={''}>{t("Makes.Make")}</option>
                        {makes && makes.map(make => (
                            <option key={make._id} value={make._id}>
                            {CapitalizeNames(make.name)}
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
                        error={Boolean(touched.store && errors.store)}
                        fullWidth
                        helperText={touched.store && errors.store}
                        name="store"
                        onBlur={handleBlur}
                        disabled={disableInput}
                        onChange={handleChange}
                        variant="outlined"
                        select
                        SelectProps={{ native: true }}
                        value={values.store}

                      >
                        <option key={0} value={''}>{t("Stores.Store")}</option>
                        {stores && stores.map(store => (
                            <option key={store._id} value={store._id}>
                            {CapitalizeNames(store.make.name + ' ' + store.name)}
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
                        error={Boolean(touched.agencyName && errors.agencyName)}
                        fullWidth
                        helperText={touched.agencyName && errors.agencyName}
                        label={t("OmsGlobals.AgencyName")}
                        name="agencyName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        value={values.agencyName}
                      />
                    </Grid>
                    
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.descModel && errors.descModel)}
                        fullWidth
                        helperText={touched.descModel && errors.descModel}
                        label={t("Vehicles.Model")}
                        name="descModel"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        value={values.descModel}

                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.serie && errors.serie)}
                        fullWidth
                        helperText={touched.serie && errors.serie}
                        label={t("OmsGlobals.Serie")}
                        name="serie"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        value={values.serie}

                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.color && errors.color)}
                        fullWidth
                        helperText={touched.color && errors.color}
                        label={t("OmsGlobals.Color")}
                        name="color"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        value={values.color}

                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.key && errors.key)}
                        fullWidth
                        helperText={touched.key && errors.key}
                        label={t("OmsGlobals.Key")}
                        name="key"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        value={values.key}

                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.year && errors.year)}
                        fullWidth
                        helperText={touched.year && errors.year}
                        label={t("Vehicles.Year")}
                        name="year"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        value={values.year}

                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.yearModel && errors.yearModel)}
                        fullWidth
                        helperText={touched.yearModel && errors.yearModel}
                        label={t("OmsGlobals.YearModel")}
                        name="yearModel"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        value={values.yearModel}

                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.modeType && errors.modeType)}
                        fullWidth
                        helperText={touched.modeType && errors.modeType}
                        label={t("OmsGlobals.ModeType")}
                        name="modeType"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        value={values.modeType}

                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.modeDescription && errors.modeDescription)}
                        fullWidth
                        helperText={touched.modeDescription && errors.modeDescription}
                        label={t("OmsGlobals.ModeDescription")}
                        name="modeDescription"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        value={values.modeDescription}

                      />
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
                        label={t("OmsGlobals.Seller")}
                        name="seller"
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                        error={Boolean(touched.inventory && errors.inventory)}
                        fullWidth
                        helperText={touched.inventory && errors.inventory}
                        label={t("OmsGlobals.Inventory")}
                        name="inventory"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        value={values.inventory}

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
                </CardContent>
                <Divider />
                <Box
                  p={2}
                  display="flex"
                  justifyContent="flex-end"
                >
                  {
                vehicleContext.loading || storeContext.loading ? (
                  <>
                  <Typography style={{marginTop: 10}} variant='h5'>{t("Buttons.LoadingInfo")}</Typography><Spinner style={{paddingRight: 10}} width={45}/>
                  </>

                  ) : (
                  loading && updating ?
                  ( 
                    <>
                      <Typography style={{marginTop: 10}} variant='h5'>{t("Buttons.LoadingInfo")}</Typography><Spinner style={{paddingRight: 10}} width={45}/>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {t("Buttons.Update")} {t("Leads.Lead")}
                    </Button> 
                  )
                )
              }
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
