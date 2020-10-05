/*eslint no-unused-vars: 0*/
import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Grid,
  makeStyles,
  Breadcrumbs,
  Button,
  Link,
  FormControlLabel,
  Switch,
  Menu,
  MenuItem,
  SvgIcon,
  Typography,
  TextField,
  ButtonGroup
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Page from 'src/components/Page';
//import AreaChart from './AreaChart';
import LineChart from './LineChart';
import useStore from 'src/hooks/useStore';

//import RadialChart from './RadialChart';
import useLead from 'src/hooks/useLead';
import moment from 'moment';
import { 
  Calendar as CalendarIcon,
  BarChart2 as BarIcon,
  Circle as CakeIcon
 } from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import useMake from 'src/hooks/useMake';
import useAuth from 'src/hooks/useAuth';
import useStatus from 'src/hooks/useStatus';
import useSource from 'src/hooks/useSource';

const timeRanges = [
  {
    value: 'today',
    text: 'Today'
  },
  {
    value: 'yesterday',
    text: 'Yesterday'
  },
  {
    value: 'month',
    text: 'This month'
  },
  {
    value: '6month',
    text: 'Last 6 months'
  },
  {
    value: 'year',
    text: 'This year'
  }
];

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const ApexChartsView = ({ className, ...rest }) => {
  const classes = useStyles();
  const { leads, getLeadsAR } = useLead();
  const [timeRange, setTimeRange] = useState(timeRanges[2].text);
  const actionRef = useRef(null);
  const { stores, getStores, getStoresByMake} = useStore();
  const [storeSearch, setStoreSearch] = useState('');
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [makeSearch, setMakeSearch] = useState('');
  const [date, setDate] = useState(`&after=${moment().startOf('month').format('YYYY-MM-DD')}`);
  const { user } = useAuth();
  const [filter, setFilter] = useState('D-MMM');
  const [sourceSearch, setSourceSearch] = useState('');
  const { statuses, getStatuses } = useStatus();
  const [switchB, setSwitchB] = useState(true);
  const [typeBar, setTypeBar] = useState('column');
  const [showInfo, setShowInfo] = useState('sources');
  const { sources, getSources } = useSource();
  const { makes, getMakes } = useMake();
  const [arrIds, setArrIds] = useState('');
  const [arrIdsS, setArrIdsS] = useState('');

  useEffect(() => {
    getLeadsAR(`${makeSearch}${sourceSearch}${storeSearch}${date}`, 'all2')


    //eslint-disable-next-line
  }, []);
  useEffect(()=>{
    setStoreSearch('&store=')
    //eslint-disable-next-line
  },[makeSearch])
  useEffect(()=>{
    getMakes();
    getStatuses();
    getSources();
    getStores();
    //eslint-disable-next-line
  },[])

  const findStores = async(id) =>{
    await getStoresByMake(id);
  };

  useEffect(()=>{
    getLeadsAR(`${makeSearch}${sourceSearch}${storeSearch}${date}`, 'all2')
    //eslint-disable-next-line
  },[makeSearch, sourceSearch, storeSearch, date,])

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

  useEffect(()=>{
    let stArrS = [];
    if(sources){
      sources.map( st => {
        stArrS.push({[st.name]:st._id})
        return false
      })
    }
    setArrIdsS(stArrS)
    //eslint-disable-next-line
  },[sources])

  const handleChangeTime = filter => {
    setTimeRange(filter);
    setFilter();
    switch (filter) {
      case 'today':
        setDate(`&after=${moment().format('YYYY-MM-DD')}`)
        setFilter('LT');

        break;
      case 'yesterday':
        setDate(`&after=${moment()
          .subtract('1', 'days')
          .format('YYYY-MM-DD')}&before=${moment().format(
          'YYYY-MM-DD'
        )}`);
        setFilter('LT');

        break;
      case 'month':
        setDate(`&after=${moment().startOf('month').format('YYYY-MM-DD')}`);
        setFilter('D-MMM');

        break;
      case '6month':
        setDate(`&after=${
          moment()
            .startOf('month')
            .subtract('6', 'months').format('YYYY-MM-DD')
        }`);
        setFilter('MMMM');

        break;
      case 'year':
        setDate(`&after=${moment().startOf('year').format('YYYY-MM-DD')}`);
        setFilter('MMMM');
        break;

      default:
        break;
    }
  };

  return (
    <Page className={classes.root} title="ApexCharts">
      <Container maxWidth="lg">
        <Grid container spacing={3} justify="space-between">
          <Grid item>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Link
                variant="body1"
                color="inherit"
                to="/app"
                component={RouterLink}
              >
                Dashboard
              </Link>
              <Typography variant="body1" color="textPrimary">
                Reports
              </Typography>
              <Typography variant="body1" color="textPrimary">
                Charts
              </Typography>
            </Breadcrumbs>
            <Typography variant="h3" color="textPrimary">
              Sold Leads
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
          {user && user.role === 'rockstar' ? (
            <Grid item xs={4} md={4}>
            <Typography variant='body1' color='textPrimary'>
                Make
            </Typography>
            <TextField
                fullWidth
                name="make"
                onChange={(e)=>{ 
                  setMakeSearch(`&make=${e.target.value}`)
                }}
                disabled={user && user.role === 'rockstar' ? false : true}
                select
                variant="outlined"
                SelectProps={{ native: true }}
                >
                <option key={0} value={''}>All</option>

                {makes && makes.map(make => (
                    <option key={make._id} value={make._id}>
                    {make.name.charAt(0).toUpperCase() + make.name.slice(1)}
                    </option>
                ))}
            </TextField>
          </Grid>
          ):false}
          <Grid item xs={4} md={4}>
            <Typography variant='body1' color='textPrimary'>
                Source
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
                <option key={0} value={''}>All</option>

                {sources && sources.map(source => (
                    <option key={source._id} value={source._id}>
                    {source.name.charAt(0).toUpperCase() + source.name.slice(1)}
                    </option>
                ))}
            </TextField>
            </Grid>
            <Grid item xs={4} md={4}>
          <Typography variant='body1' color='textPrimary'>
                Store
            </Typography>
            <TextField
                fullWidth
                name="store"
                onChange={(e)=>{ setStoreSearch(`&store=${e.target.value}`)}}
                select
                required
                variant="outlined"
                SelectProps={{ native: true }}
                >
                <option key={0} value={''}>All</option>

                {stores && stores.map(store => (
                    <option key={store._id} value={store._id}>
                    {store.name.charAt(0).toUpperCase() + store.name.slice(1)}
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
                }}><BarIcon /> <p style={{marginLeft: 5, fontSize: 14}}>Bar</p></Button>
                <Button style={{'textTransform': 'capitalize'}} variant={typeBar === 'pie' ? 'contained' : 'outlined'}  onClick={(e)=>{
                  setTypeBar('pie') 
                }}><CakeIcon /><p style={{marginLeft: 5, fontSize: 14}}>Cake</p></Button>
              </ButtonGroup>
            </Grid>
              
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}>

            <LineChart leads={leads} filter={filter} type={typeBar} ids={arrIds} idsS={arrIdsS} showInfo={showInfo} />
          </Grid>{/*
          <Grid item xs={12} md={8}>
            <AreaChart leads={leads} filter={filter} />
          </Grid>
          <Grid item xs={12} md={4}>
            <RadialChart />
          </Grid>*/}
        </Grid>
      </Container>
    </Page>
  );
};

export default ApexChartsView;
