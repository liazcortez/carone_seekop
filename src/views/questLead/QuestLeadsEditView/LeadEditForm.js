import React, {useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import useQuestLead from 'src/hooks/useQuestLead';
import { useHistory } from 'react-router-dom';
import { DateTimePicker } from '@material-ui/pickers';
import useSource from 'src/hooks/useSource';
import AlertP from 'src/components/Alert';
import useAuth from 'src/hooks/useAuth';
import useVehicle from 'src/hooks/useVehicle';
import useStore from 'src/hooks/useStore';
import useCompany from 'src/hooks/useCompany';
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
  const { updateQuestLead, error, loading } = useQuestLead();
  const { getVehicles, vehicles, getVehiclesByMake } = useVehicle();
  const vehicleContext = useContext(VehicleContext);
  const { sources, getSources } = useSource();
  const { user } = useAuth();
  const { stores, getStores } = useStore();
  const [updating, seTUpdating] = useState(false)
  const storeContext = useContext(StoreContext);
  const { getCompanies } = useCompany();
  const [disableStoreInput, setDisableStoreInput] = useState(false)
  // const [initialIdStore, setInitialIdStore] = useState('')
  const history = useHistory();
  const [submitedForm, setSubmitedForm] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    
    if(submitedForm){
      if(!error){
        enqueueSnackbar(t("SnackBar.LeadUpdated"), {
          variant: 'success'
        });
        history.push(`/app/management/questLeads/${lead._id}`);
      }
      setSubmitedForm(false)
    }

    // eslint-disable-next-line
  }, [submitedForm]);

  useEffect(() => {
    if(user && user.role && user.store && user.role === 'admin'){
      setDisableStoreInput(true);
      // setInitialIdStore(user.store._id);
      getVehiclesByMake(user.store.make._id);

    }else{
      getStores();
    }
    // eslint-disable-next-line
  }, [user])

  useEffect(() => {
   
    getSources()
    getVehicles();
    getCompanies();
    // eslint-disable-next-line
  }, [])

  return (
    <Formik
          enableReinitialize
          initialValues={{
            store: (lead && lead.store && lead.store._id) || '',
            idQuest: (lead && lead.idQuest) || '',
            name: (lead && CapitalizeNames(lead.name)) || '',
            phone: (lead && lead.phone && lead.phone.replace(/\+/g, "") ) || '',
            email:(lead && lead.email) || '',
            sellerKey: (lead && lead.sellerKey) || '',
            seller: (lead && CapitalizeNames(lead.seller)) || '',
            sellerEmail: (lead && lead.sellerEmail) || '',
            source: (lead && lead.source && lead.source._id) || '',
            date: (lead && lead.date) || '',
            hour: (lead && lead.hour) || '',
            onAccount: (lead && lead.onAccount) || '',
            model: (lead && lead.model && lead.model._id) || '',
            make: (lead && lead.store && lead.store.make && lead.store.make._id) || ''
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(255),
            phone: Yup.number(),
            seller: Yup.string().max(255),
            onAccount: Yup.string().max(20),

            email: Yup.string().email(t("Yup.Email")).max(255).required(t("Yup.EmailReq")),
            sellerEmail: Yup.string().email(t("Yup.Email")).max(255).required(t("Yup.EmailReq")),
          })}
          onSubmit={async (values, {
            resetForm,
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            try {
              seTUpdating(true)
              await updateQuestLead(values, lead._id);
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
                <CardHeader title={t("QuestLeads.Client")} />
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
                        label={t("QuestLeads.Name")}
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
                        helperText={touched.email && errors.email}
                        label={t("QuestLeads.Email")}
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
                        label={t("QuestLeads.Phone")}
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
                        error={Boolean(touched.idQuest && errors.idQuest)}
                        fullWidth
                        label={t("QuestLeads.TabletKey")}
                        name="idQuest"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.idQuest}
                        variant="outlined"
                      />
                    </Grid>
                    </Grid>
                
                </CardContent>

                <CardHeader title={t("QuestLeads.Seller")} />
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
                        error={Boolean(touched.sellerKey && errors.sellerKey)}
                        fullWidth
                        helperText={touched.sellerKey && errors.sellerKey}
                        label={t("QuestLeads.SellerKey")}
                        name="sellerKey"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        value={values.sellerKey}
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
                        label={t("QuestLeads.Seller")}
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
                        error={Boolean(touched.sellerEmail && errors.sellerEmail)}
                        fullWidth
                        helperText={touched.sellerEmail && errors.sellerEmail}
                        label={t("QuestLeads.SellerEmail")}
                        name="sellerEmail"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        value={values.sellerEmail}
                      />
                    </Grid>
                  </Grid>
                </CardContent>

             
                  <CardHeader title={t("Leads.Lead")} />
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
                        error={Boolean(touched.source && errors.source)}
                        fullWidth
                        helperText={touched.source && errors.source}
                        label={t("QuestLeads.Source")}
                        name="source"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        SelectProps={{ native: true }}
                        select
                        value={values.source}
                        >
                          <option key={0} value={''}>
                          </option>

                        {sources && sources.map(source => (
                          <option key={ source._id } value={source._id}>
                            {CapitalizeNames(source.name)}
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
                        id={'store'}
                        error={Boolean(touched.store && errors.store)}
                        fullWidth
                        helperText={touched.store && errors.store}
                        label={t("Forms.Store")}
                        name="store"
                        onBlur={handleBlur}
                        disabled={disableStoreInput}
                        onChange={(e) => { 
                          values.store = e.target.value;
                         
                          values.make = e.target.options[e.target.options.selectedIndex].getAttribute('store');
                          getVehiclesByMake(e.target.options[e.target.options.selectedIndex].getAttribute('store'));

                        }}
                        select
                        required
                        variant="outlined"
                        SelectProps={{ native: true }}
                        value={values.store}
                      >
                          <option key={0} value={''}>
                          </option>

                        {stores && stores.map(store => (
                          <option key={ store.make.name + store.name } value={store._id} store={store.make._id}>
                            {`${CapitalizeNames(store.make.name)} ${CapitalizeNames(store.name)}`}
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
                        error={Boolean(touched.model && errors.model)}
                        fullWidth
                        helperText={touched.model && errors.model}
                        label={t("Vehicles.Model")}
                        name="model"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        select
                        required
                        variant="outlined"
                        SelectProps={{ native: true }}
                        value={values.model}

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
                      
                      <DateTimePicker
                        error={Boolean(touched.date && errors.date)}
                        onBlur={handleBlur}
                        helperText={touched.date && errors.date}
                        fullWidth
                        required
                        inputVariant="outlined"
                        label={t("QuestLeads.Date")}
                        name="date"
                        onClick={() => setFieldTouched('end')}
                        onChange={(date) => {
                          setFieldValue('date', date)
                        }}
                        value={values.date}
                      />
                    </Grid>
                  
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.onAccount && errors.onAccount)}
                        fullWidth
                        helperText={touched.onAccount && errors.onAccount}
                        label={t("QuestLeads.OnAccount")}
                        name="onAccount"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        value={values.onAccount}

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
                      <Typography style={{marginTop: 10}} variant='h5'>{t("Buttons.Updating")}</Typography><Spinner style={{paddingRight: 10}} width={45}/>
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
