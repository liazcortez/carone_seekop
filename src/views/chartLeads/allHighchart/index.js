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
  ButtonGroup
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Page from 'src/components/Page';
import Chart from './Chart';
import useLead from 'src/hooks/useLead';
import moment from 'moment';
import { 
  Calendar as CalendarIcon,
  BarChart2 as BarIcon,
  Circle as CakeIcon
 } from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
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
  const { user } = useAuth();
  const { statuses, getStatuses } = useStatus();
  const { sources, getSources } = useSource();
  const [timeRange, setTimeRange] = useState(timeRanges[2].text);
  const actionRef = useRef(null);
  const [drill, setDrill] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('LT');
  const [makeSearch, setMakeSearch] = useState('');
  const [sourceSearch, setSourceSearch] = useState('');
  const [statusSearch, setStatusSearch] = useState('');
  const [typeBar, setTypeBar] = useState('column');

  const [date, setDate] = useState(`&after=${moment().startOf('month').format('YYYY-MM-DD')}`);

  useEffect(()=>{
    getStatuses();
    getSources();
    //eslint-disable-next-line
  },[])

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
    getLeadsAR(`${makeSearch}${statusSearch}${sourceSearch}${date}`, 'models')
    //eslint-disable-next-line
  },[makeSearch, statusSearch, sourceSearch, date,])

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
              {user && user.role !== 'rockstar' ? user.store && user.store.make.name : false} Global Report
            </Typography>
          </Grid>
          <Grid item>
            <Button
              ref={actionRef}
              onClick={() => {
                if(!drill){
                  setMenuOpen(true);
                }}}
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
                disabled={drill}
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
                disabled={drill}

                >
                <option key={0} value={''}>All</option>

                {sources && sources.map(source => (
                    <option key={source._id} value={source._id}>
                    {source.name.charAt(0).toUpperCase() + source.name.slice(1)}
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
                  if(!drill){
                    setTypeBar('column') 
                  }
                }}><BarIcon /> <p style={{marginLeft: 5, fontSize: 14}}>Bar</p></Button>
                <Button style={{'textTransform': 'capitalize'}} variant={typeBar === 'pie' ? 'contained' : 'outlined'}  onClick={(e)=>{
                  if(!drill){
                    setTypeBar('pie') 
                  }
                }}><CakeIcon /><p style={{marginLeft: 5, fontSize: 14}}>Cake</p></Button>
              </ButtonGroup>
            </Grid>
           
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}> 
            <Chart leads={leads} filter={filter} setDrill={setDrill} type={typeBar}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ApexChartsView;
