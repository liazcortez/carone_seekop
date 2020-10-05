import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  makeStyles,
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import FbLeads from './FbLeads';
import useLead from 'src/hooks/useLead';
import Cost from './Cost';
import AnalyticsChart from './AnalyticsChart';
import CostPerLead from './CostPerLead';
import useAuth from 'src/hooks/useAuth';
import moment from 'moment';
import useSocialAccount from 'src/hooks/useSocialAccount';
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    ///
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'

  },
  avatar: {
    backgroundColor: theme.palette.text.secondary,
    color: theme.palette.secondary.contrastText,
    height: 48,
    width: 48
  }
}));
const DashboardView = ({className, ...rest}) => {
  const classes = useStyles();
  const [dateM, setDate] = useState('month');
  const { user }= useAuth();  
  const [account, setAccount] = useState();
  const { socialAccounts, getSocialAccounts, getSocialAccountByStore} = useSocialAccount();
  const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const { getAnalytics, analytics, getAnalyticsMetrics, labels, metrics, clearMetrics, loading } = useLead();
  const handleFilterChange = (date) =>{
    setDate(date)
  }

  const handleAccountChange = (array)=>{
    setAccount(array)
  }

  useEffect(()=>{
    let ArrayIds = [];

    if(socialAccounts){
      socialAccounts.map(sa => {
        ArrayIds.push({account: sa.account ,name: sa.name})
        return 0;
      });
      setAccount(ArrayIds)
    }
    //eslint-disable-next-line
  },[socialAccounts])


  useEffect(()=>{
    
    if(user && user.role && user.store){
      if(user === 'admin'){
        console.log('admin')
        getSocialAccountByStore(user.store._id)
      }else if(user.role === 'super admin' || user.role === 'rockstar'){
        getSocialAccounts();
      }
    }
    //eslint-disable-next-line 
  },[user])

  useEffect(() => {
    switch (dateM) {
      case 'today':
        setStartDate(moment().subtract('1', 'days').format('YYYY-MM-DD'));
        setEndDate(moment().add('1','days').format('YYYY-MM-DD'));
        break;
      case 'yesterday':
        setStartDate(moment().subtract('2', 'days').format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
        break;
      case 'month':
        setStartDate(moment().startOf('month').format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
        break;
      case '6month':
        setStartDate(moment().startOf('month').subtract('6','months').format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
          break;
      case 'year':
        setStartDate(moment().startOf('year').format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
          break;
      default:
        break;
    }

    //eslint-disable-next-line
  }, [dateM]);

  useEffect(()=>{
    if(account){
      getAnalytics(startDate, endDate, account);
    }
    //eslint-disable-next-line
  },[endDate, startDate, account])

  useEffect(()=>{
    
    let string = '';
    if(account && account.length>0){
      account.map((a, i)=>{
        if(i === 0){
          string += '"' + a.account + '"';
        }else{
          string += ',"' + a.account + '"';
        }
        return 0;

      })

      getAnalyticsMetrics(startDate, endDate, string);
    }else{
      clearMetrics()
    }
    //eslint-disable-next-line
  },[account, startDate, endDate])
  return (
    <Page
      className={classes.root}
      title='Dashboard'
    >
      <Container maxWidth={false}>
        <Header filterChange={handleFilterChange} accountChange={handleAccountChange}/>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            md={4}
            lg={4}
            xs={12}
            sm={6}
          >
            <FbLeads  data={metrics ? (metrics.length>0 ? metrics[0]: 0) : 0}/>
          </Grid>
          <Grid
            item
            md={4}
            lg={4}
            xs={12}
            sm={6}
          >
            <Cost  data={metrics ? (metrics.length>0 ? metrics[1]: 0) : 0}/>
          </Grid>
          <Grid
            item
            md={4}
            lg={4}
            xs={12}
            sm={6}
          >
            <CostPerLead  data={metrics ? (metrics.length>0 ? metrics[2]: 0) : 0}/>

          </Grid>
          <Grid
            item
            md={12}
            lg={12}
            xs={12}
            sm={12}
          >
            <AnalyticsChart analytics={analytics} labels={labels} loading={loading}/>
        </Grid>
          </Grid>
      </Container>
    </Page>
  );
};

export default DashboardView;