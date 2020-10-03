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
import { useHistory } from 'react-router';
import Page from 'src/components/Page';
import Header from './Header';
import NewLeads from './NewLeads';
import useLead from 'src/hooks/useLead';
import SoldLeads from './SoldLeads';
import FollowLeads from './FollowLeads';
import LeadsByUser from './LeadsByUser';
import PerformanceOverTime from './PerformanceOverTime';
import moment from 'moment';
import MonthLeads from './MonthLeads';
import useStatus from 'src/hooks/useStatus'
import useAppointment from 'src/hooks/useAppointment';
import useAuth from 'src/hooks/useAuth';

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
  const { leads, getLeadsAR, newS, follow, sold, date, loading, getLeadsByStore } = useLead();
  const [filter, setFilter] = useState('D-MMM');
  const [dateM, setDate] = useState('month');
  const [title, setTitle] = useState(`This month`);

  const [statusNew, setStatusNew] = useState();
  const [statusSold, setStatusSold] = useState();
  const [statusFollow, setStatusFollow] = useState();
  const [roleUserSearch, setRoleUserSearch] = useState('');
  const { getStatuses, statuses } = useStatus();
  const { getAppointmentsAR } = useAppointment();
  const history = useHistory();
  const { user } = useAuth();
  const [arrIds, setArrIds] = useState('')

  const handleFilterChange = (fil,title,date) =>{
    setFilter(fil)
    setTitle(title)
    setDate(date)
  }

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
    getStatuses();
    //eslint-disable-next-line
  }, [])


  useEffect(()=>{
    if(user.role && user.store){
        setRoleUserSearch(`&store=${user.store._id}`);
        getLeadsByStore(user.store._id,'');
    }

    if((user && user.role) && (user.role === 'rockstar' || user.role === 'super admin' || user.role === 'user')){
      history.push('/');
    }
    //eslint-disable-next-line
  },[user]);
  

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
         getLeadsAR(`?createdAt[gte]=${moment().format('YYYY-MM-DD')}${roleUserSearch}`,'date');
         getLeadsAR(`?createdAt[gte]=${moment().format('YYYY-MM-DD')}&status=${statusNew}${roleUserSearch}`,'new');
         getLeadsAR(`?createdAt[gte]=${moment().format('YYYY-MM-DD')}&status=${statusSold}${roleUserSearch}`,'sold');
         getLeadsAR(`?createdAt[gte]=${moment().format('YYYY-MM-DD')}&status=${statusFollow}${roleUserSearch}`,'followup');
         getAppointmentsAR(`?user=${user._id}&createdAt[gte]=${moment().format('YYYY-MM-DD')}`);  
  
        break;
      case 'yesterday':

         getLeadsAR(`?createdAt[gt]=${moment().subtract('1','days').format('YYYY-MM-DD')}&createdAt[lt]=${moment().format('YYYY-MM-DD')}${roleUserSearch}`,'date');
         getLeadsAR(`?createdAt[gt]=${moment().subtract('1','days').format('YYYY-MM-DD')}&createdAt[lt]=${moment().format('YYYY-MM-DD')}&status=${statusNew}${roleUserSearch}`,'new');
         getLeadsAR(`?createdAt[gt]=${moment().subtract('1','days').format('YYYY-MM-DD')}&createdAt[lt]=${moment().format('YYYY-MM-DD')}&status=${statusSold}${roleUserSearch}`,'sold');
         getLeadsAR(`?createdAt[gt]=${moment().subtract('1','days').format('YYYY-MM-DD')}&createdAt[lt]=${moment().format('YYYY-MM-DD')}&status=${statusFollow}${roleUserSearch}`,'followup');
         getAppointmentsAR(`?user=${user._id}&createdAt[gt]=${moment().subtract('1','days').format('YYYY-MM-DD')}&createdAt[lt]=${moment().format('YYYY-MM-DD')}`);
  
        break;
      case 'month':
         getLeadsAR(`?createdAt[gte]=${moment().startOf('month').format('YYYY-MM-DD')}${roleUserSearch}`,'date');
         getLeadsAR(`?createdAt[gte]=${moment().startOf('month').format('YYYY-MM-DD')}&status=${statusNew}${roleUserSearch}`,'new');
         getLeadsAR(`?createdAt[gte]=${moment().startOf('month').format('YYYY-MM-DD')}&status=${statusSold}${roleUserSearch}`,'sold');
         getLeadsAR(`?createdAt[gte]=${moment().startOf('month').format('YYYY-MM-DD')}&status=${statusFollow}${roleUserSearch}`,'followup');
         getAppointmentsAR(`?user=${user._id}&createdAt[gt]=${moment().startOf('month')._d}`);

        break;
      case '6month':

         getLeadsAR(`?createdAt[gte]=${moment().startOf('month').subtract('6','months')._d}${roleUserSearch}`,'date');
         getLeadsAR(`?createdAt[gte]=${moment().startOf('month').subtract('6','months')._d}&status=${statusNew}${roleUserSearch}`,'new');
         getLeadsAR(`?createdAt[gte]=${moment().startOf('month').subtract('6','months')._d}&status=${statusSold}${roleUserSearch}`,'sold');
         getLeadsAR(`?createdAt[gte]=${moment().startOf('month').subtract('6','months')._d}&status=${statusFollow}${roleUserSearch}`,'followup');
         getAppointmentsAR(`?user=${user._id}&createdAt[gt]=${moment().startOf('month').subtract('6','months')._d}`);
  
        break;
      case 'year':

         getLeadsAR(`?createdAt[gte]=${moment().startOf('year')._d}${roleUserSearch}`,'date');
         getLeadsAR(`?createdAt[gte]=${moment().startOf('year')._d}&status=${statusNew}${roleUserSearch}`,'new');
         getLeadsAR(`?createdAt[gte]=${moment().startOf('year')._d}&status=${statusSold}${roleUserSearch}`,'sold');
         getLeadsAR(`?createdAt[gte]=${moment().startOf('year')._d}&status=${statusFollow}${roleUserSearch}`,'followup');
         getAppointmentsAR(`?user=${user._id}&createdAt[gte]=${moment().startOf('year')._d}`);

        break;
    
      default:
        break;
    }
    //eslint-disable-next-line
  }, [dateM, roleUserSearch, statusSold]);

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
            lg={12}
            md={12}
            sm={12}
            xs={12}
          >
            <PerformanceOverTime leads={leads} filter={filter} title={title}/>
          </Grid>
          </Grid>
          <Grid
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
            <LeadsByUser leads={leads} ids={arrIds}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default DashboardView;
