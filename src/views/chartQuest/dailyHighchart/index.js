import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  makeStyles,
  Breadcrumbs,
  Button,
  Link,
  Typography,
  TextField,
  ButtonGroup
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import BackDrop from 'src/components/Backdrop';
import Page from 'src/components/Page';
import LineChart from './Chart';
import { CapitalizeNames } from 'src/utils/capitalize';
import useStore from 'src/hooks/useStore';
import useQuestLead from 'src/hooks/useQuestLead';
import { 
  BarChart2 as BarIcon,
  Circle as CakeIcon
 } from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import useMake from 'src/hooks/useMake';
import useAuth from 'src/hooks/useAuth';
import useSource from 'src/hooks/useSource';
import { useTranslation } from 'react-i18next'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

let contar = 0;
const ApexChartsView = ({ className, ...rest }) => {
  const classes = useStyles();
  const { chart, getQuestLeadsAR, loading, clearState } = useQuestLead();
  const { stores, getStores, getStoresByMake} = useStore();
  const [storeSearch, setStoreSearch] = useState('');
  const [makeSearch, setMakeSearch] = useState('');
  const { user } = useAuth();
  const [sourceSearch, setSourceSearch] = useState('');
  const [typeBar, setTypeBar] = useState('column');
  const { sources, getSources } = useSource();
  const { makes, getMakes } = useMake();
  const { t } = useTranslation()


  useEffect(() => {
    getQuestLeadsAR(`${makeSearch}${sourceSearch}${storeSearch}&after=${moment().subtract(12, 'months').format('YYYY-MM-DD')}&chart=daily`)
    //eslint-disable-next-line
  }, []);

  useEffect(()=>{
    setStoreSearch('&store=')
    //eslint-disable-next-line
  },[makeSearch])

  useEffect(()=>{
    clearState()
    getMakes();
    getSources();
    getStores();
    //eslint-disable-next-line
  },[])

  const findStores = async(id) =>{
    await getStoresByMake(id);
  };

  const reload = () =>{
    getQuestLeadsAR(`${makeSearch}${sourceSearch}${storeSearch}&after=${moment().subtract(12, 'months').format('YYYY-MM-DD')}&chart=daily`)

  }

  useEffect(()=>{
    if(contar > 1){
      getQuestLeadsAR(`${makeSearch}${sourceSearch}${storeSearch}&after=${moment().subtract(12, 'months').format('YYYY-MM-DD')}&chart=daily`)
    }
    contar++;
    //eslint-disable-next-line
  },[makeSearch, sourceSearch,storeSearch])

  return (
    <Page className={classes.root} title="ApexCharts">
      <BackDrop loading={loading}  chart={chart} />
      <Container maxWidth={false}>
        <Grid container spacing={3} justify="space-between">
          <Grid item>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Link
                variant="body1"
                color="inherit"
                to="/app/reports/dashboardRockstar"
                component={RouterLink}
              >
                {t("BreadCumbs.Dashboard")}
              </Link>
              <Typography variant="body1" color="textPrimary">
                  {t("BreadCumbs.Reports")}
              </Typography>
              <Typography variant="body1" color="textPrimary">
                  {t("BreadCumbs.Charts")}
              </Typography>
            </Breadcrumbs>
            <Typography variant="h3" color="textPrimary">
            {t("Charts.Daily2")}
            </Typography>
          </Grid>
        </Grid> 

        <Grid container spacing={3} style={{marginBottom: 35}}>
          {user && (user.role === 'rockstar'|| user.role === 'super admin') ? (
            <Grid item xs={4} md={4}>
            <Typography variant='body1' color='textPrimary'>
                {t("Charts.Make")}
            </Typography>
            <TextField
                fullWidth
                name="make"
                onChange={(e)=>{ 
                  setMakeSearch(`&make=${e.target.value}`)
                  document.getElementById('inputStore').value= ''
                  if(e.target.value === ''){
                    getStores()
                  }else{
                    findStores(e.target.value)

                  }
                }}
                disabled={user && (user.role === 'rockstar'|| user.role === 'super admin') ? false : true}
                select
                variant="outlined"
                SelectProps={{ native: true }}
                >
                <option key={0} value={''}>{t("Tabs.All")}</option>

                {makes && makes.map(make => (
                    <option key={make._id} value={make._id}>
                    {CapitalizeNames(make.name)}
                    </option>
                ))}
            </TextField>
          </Grid>
          ):false}
          <Grid item xs={4} md={4}>
            <Typography variant='body1' color='textPrimary'>
            {t("Charts.Source")}
            </Typography>
            <TextField
                fullWidth
                name="source"
                onChange={(e)=>{ 
                  setSourceSearch(`&source=${e.target.value}`)
                }}
                select
                required
                variant="outlined"
                SelectProps={{ native: true }}
                >
                <option key={0} value={''}>{t("Tabs.All")}</option>

                {sources && sources.map(source => (
                    <option key={source._id} value={source._id}>
                    {CapitalizeNames(source.name)}
                    </option>
                ))}
            </TextField>
            </Grid> 
            <Grid item xs={4} md={4}>
          <Typography variant='body1' color='textPrimary'>
            {t("Charts.Store")}
            </Typography>
            <TextField
                id='inputStore'
                fullWidth
                name="store"
                onChange={(e)=>{ setStoreSearch(`&store=${e.target.value}`)}}
                select
                required
                variant="outlined"
                SelectProps={{ native: true }}
                >
                <option key={0} value={''}>{t("Tabs.All")}</option>

                {stores && stores.map(store => (
                    <option key={store._id} value={store._id}>
                      {CapitalizeNames(store.make.name) + ' ' + CapitalizeNames(store.name)}
                    </option>
                ))}
            </TextField>
            </Grid>
            <Grid item xs={12} md={12} container
              direction="row"
              justify="center"
              alignItems="center">
              <ButtonGroup color="primary" size='large' >
                <Button style={{'textTransform': 'capitalize'}} variant={typeBar === 'column' ? 'contained' : 'outlined'}  onClick={(e)=>{ 
                  setTypeBar('column') 
                }}><BarIcon /> <p style={{marginLeft: 5, fontSize: 14}}>{t("Charts.Bar")}</p></Button>
                <Button style={{'textTransform': 'capitalize'}} variant={typeBar === 'pie' ? 'contained' : 'outlined'}  onClick={(e)=>{
                  setTypeBar('pie') 
                }}><CakeIcon /><p style={{marginLeft: 5, fontSize: 14}}>{t("Charts.Cake")}</p></Button>
              </ButtonGroup>
            </Grid>
              
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}>

            <LineChart leads={chart} type={typeBar} reload={reload} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ApexChartsView;
