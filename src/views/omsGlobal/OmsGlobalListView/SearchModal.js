import React, { forwardRef, useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import useOmsGlobal from 'src/hooks/useOmsGlobal';
import useStatus from 'src/hooks/useStatus';
import useMake from 'src/hooks/useMake';
import useStore from 'src/hooks/useStore';
import { DateTimePicker } from '@material-ui/pickers';
import useCompany from 'src/hooks/useCompany';
import useAuth from 'src/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import { X as XIcon } from 'react-feather';
import { CapitalizeNames } from 'src/utils/capitalize';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  colors,
  Modal,
  Grid,
  CardActions,
  Box,
  IconButton
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 800,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%',
    padding: theme.spacing(3),
  },
  field: {
    marginTop: theme.spacing(3)
  },
  confirmButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    },
    marginLeft: theme.spacing(2)
  },
  cancelButton: {
    color: theme.palette.white,
    backgroundColor: colors.red[600],
    '&:hover': {
      backgroundColor: colors.red[900]
    },
    marginLeft: theme.spacing(2)
  },
  datesButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark
    }
  }
}));

const Search = forwardRef((props, ref) => {
  const {
    open,
    setOpen,
    className,
    limit,
    page,
    state,
    setState,
    setAdvancedSearch,
    setCurrentTab,
    ...rest
  } = props;

  const classes = useStyles();
  const {  AdvancedResults } = useOmsGlobal();
  const { user } = useAuth();
  const { makes, getMakes } = useMake();
  const { stores, getStores, getStoresByMake } = useStore();
  const { companies, getCompanies } = useCompany();
  const { statuses, getStatuses } = useStatus();
  const [isAdmin, setAdmin] = useState(false);
  const { t } = useTranslation();
  
  const handleSearch = () =>{
    AdvancedResults({limit: limit, page: page + 1}, state)
    setAdvancedSearch(true)
    setOpen(false)
    setCurrentTab('all')
  }

  useEffect(()=>{
    getMakes();
    getStatuses();
    getStores();
    getCompanies();
    //eslint-disable-next-line
  },[])

  useEffect(()=>{

    if(user && user.store && (user.role === 'user' || user.role === 'admin')){
        setAdmin(true)
    }
    //eslint-disable-next-line
  },[user])

  const onClose = () =>{
      setOpen(false)
  }

  return (
    <Modal
        onClose={onClose}
        open={open}
    >
    <Card
      {...rest}
      className={clsx(classes.root, className)}
      ref={ref}
    >
      <CardContent>
        <Grid container spacing={3}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box display="flex" justifyContent="center">
                    <Typography variant='h3' >{t("Buttons.AdvancedSearch")}</Typography>
                </Box>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextField
                    fullWidth
                    label={t("Leads.Name")}
                    name="name"
                    onChange={(e)=>setState({...state, [e.target.name]: e.target.value})}
                    value={state.name}
                    variant="outlined"
                />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextField
                    fullWidth
                    label={t("Leads.Email")}
                    name="email"
                    onChange={(e)=>setState({...state, [e.target.name]: e.target.value})}
                    value={state.email}
                    variant="outlined"
                />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextField
                    fullWidth
                    label={t("Leads.Phone")}
                    name="phone"
                    onChange={(e)=>setState({...state, [e.target.name]: e.target.value})}
                    value={state.phone}
                    variant="outlined"
                />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextField
                    fullWidth
                    name="company"
                    onChange={(e)=> setState({...state, [e.target.name]: `${e.target.value}/${e.target.options[e.target.options.selectedIndex].getAttribute('company')}`})}
                    select
                    variant="outlined"
                    SelectProps={{ native: true }}
                    value={state.company.split('/')[0]}
                >
                    <option key={0} value={'0/0'}>{t("AdvancedAll.Company")}</option>
                    {companies && companies.map(company => (<option key={company._id} value={company._id} company={company.name}>{CapitalizeNames(company.name)}</option>))}
                </TextField>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextField
                    fullWidth
                    name="make"
                    disabled={isAdmin}
                    onChange={(e)=>{
                      setState({...state, [e.target.name]: `${e.target.value}/${e.target.options[e.target.options.selectedIndex].getAttribute('make')}`})

                      if(e.target.value === '' || e.target.value === '0/0'){
                          getStores();
                      }else{
                          getStoresByMake(e.target.value);
                      }
                    }}
                    select
                    variant="outlined"
                    SelectProps={{ native: true }}
                    value={state.make.split('/')[0]}
                >
                    <option key={0} value={'0/0'}>{t("AdvancedAll.Makes")}</option>
                    {makes && makes.map(make => (<option key={make._id} value={make._id} make={make.name}>{CapitalizeNames(make.name)}</option>))}
                </TextField>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextField
                    fullWidth
                    name="status"
                    onChange={(e)=>{                      
                      setState({...state, [e.target.name]: `${e.target.value}/${e.target.options[e.target.options.selectedIndex].getAttribute('status')}`})
                  }}
                    select
                    variant="outlined"
                    SelectProps={{ native: true }}
                    value={state.status.split('/')[0]}
                >
                    <option key={0} value={'0/0'}>{t("AdvancedAll.Status")}</option>
                    {statuses && statuses.map(status => {
                      if(status.name !== 'default' && status.name !== 'opened'){
                        return (<option key={status._id} value={status._id} status={status.name}>{CapitalizeNames(status.name)}</option> )
                      }
                      return false;
                      }
                    )}
                </TextField>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label={t("OmsGlobals.Inventory")}
                name="inventory"
                onChange={(e)=>setState({...state, [e.target.name]: e.target.value})}
                value={state.inventory}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label={t("OmsGlobals.Serie")}
                name="serie"
                onChange={(e)=>setState({...state, [e.target.name]: e.target.value})}
                value={state.serie}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label={t("OmsGlobals.Key")}
                name="key"
                onChange={(e)=>setState({...state, [e.target.name]: e.target.value})}
                value={state.key}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label={t("OmsGlobals.Year")}
                name="year"
                onChange={(e)=>setState({...state, [e.target.name]: e.target.value})}
                value={state.year}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label={t("OmsGlobals.ModeType")}
                name="modeType"
                onChange={(e)=>setState({...state, [e.target.name]: e.target.value})}
                value={state.modeType}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label={t("OmsGlobals.ModeDescription")}
                name="modeDescription"
                onChange={(e)=>setState({...state, [e.target.name]: e.target.value})}
                value={state.modeDescription}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label={t("OmsGlobals.DescModel")}
                name="descModel"
                onChange={(e)=>setState({...state, [e.target.name]: e.target.value})}
                value={state.descModel}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label={t("OmsGlobals.YearModel")}
                name="yearModel"
                onChange={(e)=>setState({...state, [e.target.name]: e.target.value})}
                value={state.yearModel}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextField
                    fullWidth
                    name="store"
                    disabled={isAdmin}
                    onChange={(e)=> setState({...state, [e.target.name]: `${e.target.value}/${e.target.options[e.target.options.selectedIndex].getAttribute('store')}`})}
                    select
                    variant="outlined"
                    SelectProps={{ native: true }}
                    value={state.store.split('/')[0]}
                >
                    <option key={0} value={'0/0'}>{t("AdvancedAll.Stores")}</option>
                    {stores && stores.map(store => (<option key={store._id} value={store._id} store={store.name}>{CapitalizeNames(store.name)}</option>))}
                </TextField>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label={t("OmsGlobals.Payment")}
                name="methodPayment"
                onChange={(e)=>setState({...state, [e.target.name]: e.target.value})}
                value={state.methodPayment}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label={t("OmsGlobals.State")}
                name="stateName"
                onChange={(e)=>setState({...state, [e.target.name]: e.target.value})}
                value={state.stateName}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label={t("OmsGlobals.Municipy")}
                name="municipyName"
                onChange={(e)=>setState({...state, [e.target.name]: e.target.value})}
                value={state.municipyName}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label={t("OmsGlobals.Colony")}
                name="faauColony"
                onChange={(e)=>setState({...state, [e.target.name]: e.target.value})}
                value={state.faauColony}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label={t("OmsGlobals.Seller")}
                name="seller"
                onChange={(e)=>setState({...state, [e.target.name]: e.target.value})}
                value={state.seller}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label={t("OmsGlobals.Color")}
                name="color"
                onChange={(e)=>setState({...state, [e.target.name]: e.target.value})}
                value={state.color}
                variant="outlined"
              />
            </Grid>
            <Grid item lg={11} md={11} sm={11} xs={11}>
              <DateTimePicker
                fullWidth
                inputVariant="outlined"
                label={t("Keys.after")}
                name="after"
                onChange={(value) => setState({...state, after: value._d})}
                value={state.after}
              />
            </Grid>
            <Grid item lg={1} md={1} sm={1} xs={1} style={{marginTop: 5}}>
              <IconButton className={classes.datesButton} onClick={(e)=>setState({...state, after: moment(0)._d})}>
                <XIcon />
              </IconButton>
            </Grid>
            <Grid item lg={11} md={11} sm={11} xs={11}>
              <DateTimePicker
                fullWidth
                inputVariant="outlined"
                label={t("Keys.before")}
                name="before"
                onChange={(value) => setState({...state, before: value._d})}
                value={state.before}
              />
            </Grid>
            <Grid item lg={1} md={1} sm={1} xs={1} style={{marginTop: 5}}>
              <IconButton className={classes.datesButton} onClick={(e)=>setState({...state, before: moment(0)._d})}>
                <XIcon />
              </IconButton>
            </Grid>
            
        </Grid>
      </CardContent>
      <Divider />
        <Box p={2}>
        <CardActions>
          <Box flexGrow={1} />
            <Button
              color="primary"
              variant="contained"
              className={classes.cancelButton}
              onClick={(e)=>setOpen(false)}
            >
              {t("Buttons.Cancel")}
            </Button>
            <Button 
              variant="contained"
              color="primary"
              onClick={handleSearch}
            >
              {t("Buttons.Search")}
            </Button>
        </CardActions>
        </Box>
    </Card>
    </Modal>
  );
});

Search.propTypes = {
  className: PropTypes.string,
};

export default Search;
