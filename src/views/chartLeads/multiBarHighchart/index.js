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
  FormControlLabel,
  Switch
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Page from 'src/components/Page';
import Chart from './Chart';
import useLead from 'src/hooks/useLead';
import moment from 'moment';
import { Calendar as CalendarIcon } from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import useMake from 'src/hooks/useMake';
import useAuth from 'src/hooks/useAuth';
import useStatus from 'src/hooks/useStatus';
import useSource from 'src/hooks/useSource';
import useStore from 'src/hooks/useStore';

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
  const { user } = useAuth();
  const { statuses, getStatuses } = useStatus();
  const { sources, getSources } = useSource();
  const { makes, getMakes } = useMake();
  const [timeRange, setTimeRange] = useState(timeRanges[2].text);
  const actionRef = useRef(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('LT');
  const [makeSearch, setMakeSearch] = useState('');
  const { stores, getStores, getStoresByMake} = useStore();
  const [storeSearch, setStoreSearch] = useState('');
  const [sourceSearch, setSourceSearch] = useState('');
  const [statusSearch, setStatusSearch] = useState('');
  const [date, setDate] = useState(`&after=${moment().startOf('month').format('YYYY-MM-DD')}`);
  const [typeBar, setTypeBar] = useState('column');
  const [showInfo, setShowInfo] = useState('sources');
  const [switchB, setSwitchB] = useState(true);
  const [switchB2, setSwitchB2] = useState(true);
  const [arrIds, setArrIds] = useState('')
  const [arrIdsS, setArrIdsS] = useState('')

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

  useEffect(()=>{
    if(user.store){
      if(user.role !== 'rockstar'){
      setMakeSearch(`&make=${user.store.make._id}`)
      }
    }
    //getLeadsAR(`${makeSearch}${vehicleSearch}${date}`, 'models');
    //eslint-disable-next-line
  },[user])

  useEffect(()=>{
    getLeadsAR(`${makeSearch}${statusSearch}${sourceSearch}${storeSearch}${date}`, 'models')
    //eslint-disable-next-line
  },[makeSearch, statusSearch, sourceSearch, storeSearch, date,])

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
        <Grid container spacing={3} justify="space-between" style={{marginBottom: 35}}>
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
              {user && user.role !== 'rockstar' ? user.store && user.store.make.name : false} Leads
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
            <Grid item xs={6} md={6}>
            <Typography variant='body1' color='textPrimary'>
                Make
            </Typography>
            <TextField
                fullWidth
                name="make"
                onChange={(e)=>{ 
                  setMakeSearch(`&make=${e.target.value}`)
                  if(e.target.value === ''){
                    const func = async ()=>{ await getStores();}
                    func();
                  }else{
                    findStores(e.target.value)
                  }
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
          <Grid item xs={6} md={6}>
            <Typography variant='body1' color='textPrimary'>
                Status
            </Typography>
            <TextField
                fullWidth
                name="status"
                onChange={(e)=>{ 
                  setStatusSearch(`&status=${e.target.value}`)
                }}
                select
                required
                variant="outlined"
                SelectProps={{ native: true }}
                >
                <option key={0} value={''}>All</option>

                {statuses && statuses.map(status => (
                  status.name !== 'default' ?
                    (<option key={status._id} value={status._id}>
                    {status.name.charAt(0).toUpperCase() + status.name.slice(1)}
                    </option>): false
                ))}
            </TextField>
            </Grid>
            <Grid item xs={6} md={6}>
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
            <Grid item xs={6} md={6}>
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
            <Grid item xs={6} md={6}>
            <Typography variant='body1' color='textPrimary'>
                Change Graph Type
            </Typography>
            <FormControlLabel
                control={(
                  <Switch
                    checked={switchB}
                    onChange={(e)=>{ 
                      setSwitchB(!switchB);
                      if(!switchB)
                      setTypeBar('column') 
                      else 
                      setTypeBar('line');
                    }}
                  />
                )}
              />
              </Grid>
              <Grid item xs={6} md={6}>
              <Typography variant='body1' color='textPrimary'>
                Status / Sources
              </Typography>
              <FormControlLabel
                  control={(
                    <Switch
                      checked={switchB2}
                      onChange={(e)=>{ 
                        setSwitchB2(!switchB2);
                        if(!switchB2)
                        setShowInfo('sources') 
                        else 
                        setShowInfo('statuses');
                      }}
                    />
                  )}
                />
              </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}> 
            <Chart leads={leads} filter={filter} type={typeBar} ids={arrIds} idsS={arrIdsS} showInfo={showInfo}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ApexChartsView;
