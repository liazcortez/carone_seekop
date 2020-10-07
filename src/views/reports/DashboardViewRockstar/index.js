import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  makeStyles,
  Card,
  Typography,
  Avatar,
  Box
} from '@material-ui/core';
import { AlertOctagon as Icon } from 'react-feather';
import clsx from 'clsx';
import Page from 'src/components/Page';
import Header from './Header';
// import LatestProjects from './LatestProjects';
import NewLeads from './NewLeads';
import useLead from 'src/hooks/useLead';
import { useHistory } from 'react-router';
import SoldLeads from './SoldLeads';
import FollowLeads from './FollowLeads';
import PerformanceOverTime from './LeadsByUser';
import moment from 'moment';
import MonthLeads from './MonthLeads';
import LineChart from './LineChart';
import MakesChart from './MakesChart';
import useStatus from 'src/hooks/useStatus'
import useAppointment from 'src/hooks/useAppointment';
import useAuth from 'src/hooks/useAuth';
import LeadsByStore from './LeadsByStore';

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
  const { leads, getLeads, getLeadsAR, newS, follow, sold, date, loading } = useLead();
  const [filter, setFilter] = useState('D-MMM');
  const [dateM, setDate] = useState('month');
  const [title, setTitle] = useState(`This month`);

  const [statusNew, setStatusNew] = useState();
  const [statusSold, setStatusSold] = useState();
  const [statusFollow, setStatusFollow] = useState();
  const { getStatuses, statuses } = useStatus();
  const { getAppointmentsAR } = useAppointment();
  const { user } = useAuth();
  const [arrIds, setArrIds] = useState('');
  const history = useHistory();

  const handleFilterChange = (fil,title,date) =>{
    setFilter(fil)
    setTitle(title)
    setDate(date)
  }

  useEffect(() => {
    if((user && user.role) && (user.role === 'admin'  || user.role === 'user')){
      history.push('/');
    }
   //eslint-disable-next-line
  }, [user])

  useEffect(()=>{
    let stArr = [];
    if(statuses){
      statuses.map( st => {
        if(st.name !== 'default'){
          stArr.push({[st.name]:st._id})
        }
        return false
      })
    }
    setArrIds(stArr)
    //eslint-disable-next-line
  },[statuses])

  useEffect(() => {
    getLeads();
    getStatuses();
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    statuses.map(sts => 
      sts.name === 'new' ? setStatusNew(sts._id) : 
      sts.name === 'sold' ? setStatusSold(sts._id) : 
      sts.name === 'documentation' ? setStatusFollow(sts._id) : false
    );
    //eslint-disable-next-line
  }, [statuses])

  useEffect(() => {

    switch (dateM) {
      case 'today':
         getLeadsAR(`?createdAt[gte]=${moment().format('YYYY-MM-DD')}`,'date');
         getLeadsAR(`?createdAt[gte]=${moment().format('YYYY-MM-DD')}&status=${statusNew}`,'new');
         getLeadsAR(`?createdAt[gte]=${moment().format('YYYY-MM-DD')}&status=${statusSold}`,'sold');
         getLeadsAR(`?createdAt[gte]=${moment().format('YYYY-MM-DD')}&status=${statusFollow}`,'followup');
         getAppointmentsAR(`?user=${user._id}&createdAt[gte]=${moment().format('YYYY-MM-DD')}`);  
  
        break;
      case 'yesterday':

         getLeadsAR(`?createdAt[gt]=${moment().subtract('1','days').format('YYYY-MM-DD')}&createdAt[lt]=${moment().format('YYYY-MM-DD')}`,'date');
         getLeadsAR(`?createdAt[gt]=${moment().subtract('1','days').format('YYYY-MM-DD')}&createdAt[lt]=${moment().format('YYYY-MM-DD')}&status=${statusNew}`,'new');
         getLeadsAR(`?createdAt[gt]=${moment().subtract('1','days').format('YYYY-MM-DD')}&createdAt[lt]=${moment().format('YYYY-MM-DD')}&status=${statusSold}`,'sold');
         getLeadsAR(`?createdAt[gt]=${moment().subtract('1','days').format('YYYY-MM-DD')}&createdAt[lt]=${moment().format('YYYY-MM-DD')}&status=${statusFollow}`,'followup');
         getAppointmentsAR(`?user=${user._id}&createdAt[gt]=${moment().subtract('1','days').format('YYYY-MM-DD')}&createdAt[lt]=${moment().format('YYYY-MM-DD')}`);
  
        break;
      case 'month':

         getLeadsAR(`?createdAt[gte]=${moment().startOf('month').format('YYYY-MM-DD')}`,'date');
         getLeadsAR(`?createdAt[gte]=${moment().startOf('month').format('YYYY-MM-DD')}&status=${statusNew}`,'new');
         getLeadsAR(`?createdAt[gte]=${moment().startOf('month').format('YYYY-MM-DD')}&status=${statusSold}`,'sold');
         getLeadsAR(`?createdAt[gte]=${moment().startOf('month').format('YYYY-MM-DD')}&status=${statusFollow}`,'followup');
         getAppointmentsAR(`?user=${user._id}&createdAt[gt]=${moment().startOf('month')._d}`);

        break;
      case '6month':

         getLeadsAR(`?createdAt[gte]=${moment().startOf('month').subtract('6','months')._d}`,'date');
         getLeadsAR(`?createdAt[gte]=${moment().startOf('month').subtract('6','months')._d}&status=${statusNew}`,'new');
         getLeadsAR(`?createdAt[gte]=${moment().startOf('month').subtract('6','months')._d}&status=${statusSold}`,'sold');
         getLeadsAR(`?createdAt[gte]=${moment().startOf('month').subtract('6','months')._d}&status=${statusFollow}`,'followup');
         getAppointmentsAR(`?user=${user._id}&createdAt[gt]=${moment().startOf('month').subtract('6','months')._d}`);
  
        break;
      case 'year':

         getLeadsAR(`?createdAt[gte]=${moment().startOf('year')._d}`,'date');
         getLeadsAR(`?createdAt[gte]=${moment().startOf('year')._d}&status=${statusNew}`,'new');
         getLeadsAR(`?createdAt[gte]=${moment().startOf('year')._d}&status=${statusSold}`,'sold');
         getLeadsAR(`?createdAt[gte]=${moment().startOf('year')._d}&status=${statusFollow}`,'followup');
         getAppointmentsAR(`?user=${user._id}&createdAt[gte]=${moment().startOf('year')._d}`);

        break;
    
      default:
        break;
    }
    //eslint-disable-next-line
  }, [dateM, statusSold, statusNew, statusFollow]);

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Header filterChange={handleFilterChange}/>
        <Grid
          container
          spacing={3}
        >
            <Grid
            item
            md={3}
            lg={2}
            xs={12}
            sm={6}
          >
            <MonthLeads loading={loading.toString()} date={date} title={title}/>
          </Grid>
          
          <Grid
            item
            md={3}
            lg={2}
            xs={12}
            sm={6}
          >
            <NewLeads loading={loading.toString()} new={newS} title={title}/>
          </Grid>

          <Grid
            item
            md={3}
            lg={2}
            xs={12}
            sm={6}
          >
            <FollowLeads loading={loading.toString()} follow={follow} title={title}/>
          </Grid>

          <Grid
            item
            md={3}
            lg={2}
            xs={12}
            sm={6}
          >
            <SoldLeads loading={loading.toString()} sold={sold} title={title}/>
          </Grid>
          

          <Grid
            item
            md={3}
            lg={2}
            xs={12}
            sm={6}
          >
          <Card
            className={clsx(classes.root, className)}
          >
            <Box flexGrow={1}>
              <Typography
                component="h3"
                gutterBottom
                variant="overline"
                color="textSecondary"
              >
                Proximamente
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                flexWrap="wrap"
              >
                <Typography
                  variant="h3"
                  color="textPrimary"
                >
                  . . .
                </Typography>
              </Box>
            </Box>
            <Avatar className={classes.avatar}>
              <Icon />
            </Avatar>
          </Card>
          </Grid>
          <Grid
            item
            md={3}
            lg={2}
            xs={12}
            sm={6}
          >
            <Card
            className={clsx(classes.root, className)}
          >
            <Box flexGrow={1}>
              <Typography
                component="h3"
                gutterBottom
                variant="overline"
                color="textSecondary"
              >
                Proximamente
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                flexWrap="wrap"
              >
                <Typography
                  variant="h3"
                  color="textPrimary"
                >
                  . . .
                </Typography>
              </Box>
            </Box>
            <Avatar className={classes.avatar}>
              <Icon />
            </Avatar>
          </Card>
          </Grid>
          <Grid
             item
             lg={4}
             md={12}
             sm={12}
             xs={12}
          >
            
            <LineChart leads={leads} filter={filter} title={title}/>
             
          </Grid>
          <Grid
             item
             lg={8}
             md={12}
             sm={12}
             xs={12}
          >
            
            <LeadsByStore leads={leads} ids={arrIds} filter={filter}/>
             
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
          >
            <PerformanceOverTime leads={leads} ids={arrIds} filter={filter}/>
          </Grid>

          <Grid
             item
             lg={6}
             md={6}
             sm={6}
             xs={6}
          >
            
            <MakesChart leads={leads} ids={arrIds} filter={filter}/>
             
          </Grid>
          </Grid>
          {/* <Grid
          container
          spacing={3}
          >
          <Grid
            item
            lg={12}
            md={12}
            sm={12}
            xs={12}
          >
            <LatestProjects />
          </Grid>
        </Grid> */}
      </Container>
    </Page>
  );
};

export default DashboardView;