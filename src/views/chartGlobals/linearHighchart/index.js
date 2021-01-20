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
import LineChart from './LineChart';
import useCompany from 'src/hooks/useCompany';
import { CapitalizeNames } from 'src/utils/capitalize';
import useOmsGlobal from 'src/hooks/useOmsGlobal';
import moment from 'moment';
import { 
  BarChart2 as BarIcon,
  Circle as CakeIcon
 } from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import useMake from 'src/hooks/useMake';
import useAuth from 'src/hooks/useAuth';
import { useTranslation } from 'react-i18next'

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
  const { chart, getOmsGlobalsAR, loading, clearState } = useOmsGlobal();
  const { companies, getCompanies } = useCompany();
  const [makeSearch, setMakeSearch] = useState('');
  const { user } = useAuth();
  const [companySearch, setCompanySearch] = useState('');
  const [typeBar, setTypeBar] = useState('column');
  const { makes, getMakes } = useMake();
  const { t } = useTranslation()

  useEffect(() => {
    getOmsGlobalsAR(`${makeSearch}${companySearch}&after=${moment().subtract(12, 'months').format('YYYY-MM-DD')}&chart=monthlyHC&filter=MMMM-YY`)
    //eslint-disable-next-line
  }, []);


  useEffect(()=>{
    clearState();
    getMakes();
    getCompanies();
    //eslint-disable-next-line
  },[])

  useEffect(()=>{
    if(contar > 1){
      getOmsGlobalsAR(`${makeSearch}${companySearch}&after=${moment().subtract(12, 'months').format('YYYY-MM-DD')}&chart=monthlyHC&filter=MMMM-YY`)
    }
    contar ++;
    //eslint-disable-next-line
  },[makeSearch, companySearch])

  const reload = () =>{
    getOmsGlobalsAR(`${makeSearch}${companySearch}&after=${moment().subtract(12, 'months').format('YYYY-MM-DD')}&chart=monthlyHC&filter=MMMM-YY`)

  }

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
            {t("Charts.Month2")}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={3} style={{marginBottom: 35}}>
          {user && (user.role === 'rockstar'|| user.role === 'super admin') ? (
            <Grid item xs={6} lg={6} md={6} sm={6}>
            <Typography variant='body1' color='textPrimary'>
            {t("Charts.Make")}
            </Typography>
            <TextField
                fullWidth
                name="make"
                onChange={(e)=>{setMakeSearch(`&make=${e.target.value}`)}}
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
          <Grid item xs={6} lg={6} md={6} sm={6}>
            <Typography variant='body1' color='textPrimary'>
            {t("Charts.Company")}
            </Typography>
            <TextField
                fullWidth
                name="company"
                onChange={(e)=>{ 
                  setCompanySearch(`&company=${e.target.value}`)
                }}
                select
                required
                variant="outlined"
                SelectProps={{ native: true }}
                >
                <option key={0} value={''}>{t("Tabs.All")}</option>

                {companies && companies.map(company => (
                    <option key={company._id} value={company._id}>
                    {CapitalizeNames(company.name)}
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

            <LineChart leads={chart} filter={'MMMM-YY'} type={typeBar} loading={loading} reload={reload}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ApexChartsView;
