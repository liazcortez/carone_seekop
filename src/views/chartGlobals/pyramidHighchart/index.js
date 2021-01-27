import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Grid,
  makeStyles,
  Breadcrumbs,
  Button,
  Link,
  Menu,
  MenuItem,
  SvgIcon,
  Typography,
  TextField,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import BackDrop from 'src/components/Backdrop';
import { CapitalizeNames } from 'src/utils/capitalize';
import Page from 'src/components/Page';
import PyramidChart from './PyramidChart';
import useMake from 'src/hooks/useMake';
import useOmsGlobal from 'src/hooks/useOmsGlobal';
import moment from 'moment';
import useStore from 'src/hooks/useStore';
import { Calendar as CalendarIcon } from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import useAuth from 'src/hooks/useAuth';

import useCompany from 'src/hooks/useCompany';
import { useTranslation } from 'react-i18next';

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
  const actionRef = useRef(null);
  const [makeSearch, setMakeSearch] = useState('');
  const [storeSearch, setStoreSearch] = useState('');
  const { stores, getStores, getStoresByMake } = useStore();
  const { makes, getMakes } = useMake();
  const { user } = useAuth();
  const [companySearch, setCompanySearch] = useState('');
  const { companies, getCompanies } = useCompany();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [date, setDate] = useState(`&after=${moment().startOf('month').format('YYYY-MM-DD')}`);
  const { t } = useTranslation()
  const timeRanges = [
    {
      value: 'today',
      text: t("Calendar.Today")
    },
    {
      value: 'yesterday',
      text: t("Calendar.Yesterday")
    },
    {
      value: 'month',
      text: t("Calendar.ThisMonth")
    },
    {
      value: '6month',
      text: t("Calendar.6Months")
    },
    {
      value: 'year',
      text: t("Calendar.Year")
    }
  ];

  const [timeRange, setTimeRange] = useState(timeRanges[2].text);
  useEffect(() => {
    if(user && user.role && (user.role === 'rockstar' || user.role === 'super admin'))
    getOmsGlobalsAR(`${makeSearch}${companySearch}${storeSearch}${date}&chart=statusHC`)
    //eslint-disable-next-line
  }, []);

  useEffect(()=>{
    clearState();
    getMakes();
    getStores();
    getCompanies();
    //eslint-disable-next-line
  },[])

  useEffect(()=>{
    if(contar > 0){
      getOmsGlobalsAR(`${makeSearch}${companySearch}${storeSearch}${date}&chart=statusHC`)
    }
    contar ++;
    //eslint-disable-next-line
  },[makeSearch, companySearch, storeSearch, date])

  const reload= () =>{
    getOmsGlobalsAR(`${makeSearch}${companySearch}${storeSearch}${date}&chart=statusHC`)

  }

  
  const handleChangeTime = filter => {
    setTimeRange(filter);
    switch (filter) {
      case 'today':
        setDate(`&after=${moment().format('YYYY-MM-DD')}`)

        break;
      case 'yesterday':
        setDate(`&after=${moment()
          .subtract('1', 'days')
          .format('YYYY-MM-DD')}&before=${moment().format(
          'YYYY-MM-DD'
        )}`);

        break;
      case 'month':
        setDate(`&after=${moment().startOf('month').format('YYYY-MM-DD')}`);

        break;
      case '6month':
        setDate(`&after=${
          moment()
            .startOf('month')
            .subtract('6', 'months').format('YYYY-MM-DD')
        }`);

        break;
      case 'year':
        setDate(`&after=${
          moment()
            .startOf('month')
            .subtract('12', 'months').format('YYYY-MM-DD')
        }`);
        break;

      default:
        break;
    }
  };
  return (
    <Page className={classes.root} title="ApexCharts">
      <BackDrop loading={loading} chart={chart} />
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
            {t("Charts.Lbst")}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              ref={actionRef}
              onClick={() => setMenuOpen(true)}
              startIcon={
                <SvgIcon fontSize="small">
                  <CalendarIcon />
                </SvgIcon>
              }
            >
              {timeRange}
            </Button>
            <Menu
              anchorEl={actionRef.current}
              onClose={() => setMenuOpen(false)}
              open={isMenuOpen}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
            >
              {timeRanges.map(_timeRange => (
                <MenuItem
                  key={_timeRange.value}
                  onClick={e => handleChangeTime(_timeRange.value)}
                >
                  {_timeRange.text}
                </MenuItem>
              ))}
            </Menu>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{marginBottom: 35}}>
          {user && (user.role === 'rockstar'|| user.role === 'super admin') ? (
          <>
          <Grid item xs={4} md={4}>
            <Typography variant='body1' color='textPrimary'>
            {t("Charts.Make")}
            </Typography>
            <TextField
                fullWidth
                name="make"
                onChange={(e)=>{ 
                  setMakeSearch(`&make=${e.target.value}`)
                  if(e.target.value === ''){
                    getStores()
                  }else{
                    getStoresByMake(e.target.value)
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
          <Grid item xs={4} md={4}>
            <Typography variant='body1' color='textPrimary'>
            {t("Charts.Store")}
            </Typography>
            <TextField
                fullWidth
                name="store"
                onChange={(e)=>{ 
                  setStoreSearch(`&store=${e.target.value}`)


                }}
                disabled={user && (user.role === 'rockstar'|| user.role === 'super admin') ? false : true}
                select
                variant="outlined"
                SelectProps={{ native: true }}
                >
                <option key={0} value={''}>{t("Tabs.All")}</option>

                {stores && stores.map(store => (
                    <option key={store._id} value={store._id}>
                    {CapitalizeNames(store.make.name + ' ' + store.name)}
                    </option>
                ))}
            </TextField>
          </Grid>
          <Grid item xs={4} md={4}>
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
          </>
          ):false}

        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <PyramidChart leads={chart} reload={reload}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ApexChartsView;
