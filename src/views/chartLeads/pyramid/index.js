/*eslint no-unused-vars: 0*/
import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
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
import Page from 'src/components/Page';
import PyramidChart from './PyramidChart';
import useMake from 'src/hooks/useMake';
import useLead from 'src/hooks/useLead';
import moment from 'moment';
import { Calendar as CalendarIcon } from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import useAuth from 'src/hooks/useAuth';

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
  const [makeSearch, setMakeSearch] = useState('');
  const { makes, getMakes } = useMake();
  const { user } = useAuth();
  const [sourceSearch, setSourceSearch] = useState('');
  const { sources, getSources } = useSource();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('LT');
  const [date, setDate] = useState(`&after=${moment().startOf('month').format('YYYY-MM-DD')}`);

  useEffect(() => {
    getLeadsAR(`${makeSearch}${sourceSearch}${date}`, 'all2')


    //eslint-disable-next-line
  }, []);

  useEffect(()=>{
    getMakes();
    getSources();
    //eslint-disable-next-line
  },[])

  useEffect(()=>{
    getLeadsAR(`${makeSearch}${sourceSearch}${date}`, 'all2')
    //eslint-disable-next-line
  },[makeSearch, sourceSearch, date])

  // const handleChangeTime = filter => {
  //   setTimeRange(filter);
  //   setFilter();
  //   switch (filter) {
  //     case 'today':
  //       getLeadsChart(`?createdAt[gte]=${moment().format('YYYY-MM-DD')}`);
  //       setFilter('LT');

  //       break;
  //     case 'yesterday':
  //       getLeadsChart(
  //         `?createdAt[gt]=${moment()
  //           .subtract('1', 'days')
  //           .format('YYYY-MM-DD')}&createdAt[lt]=${moment().format(
  //           'YYYY-MM-DD'
  //         )}`
  //       );
  //       setFilter('LT');

  //       break;
  //     case 'month':
  //       getLeadsChart(`?createdAt[gte]=${moment().startOf('month')._d}`);
  //       setFilter('D-MMM');

  //       break;
  //     case '6month':
  //       getLeadsChart(
  //         `?createdAt[gte]=${
  //           moment()
  //             .startOf('month')
  //             .subtract('6', 'months')._d
  //         }`
  //       );
  //       setFilter('MMMM');

  //       break;
  //     case 'year':
  //       getLeadsChart(`?createdAt[gte]=${moment().startOf('year')._d}`);
  //       setFilter('MMMM');
  //       break;

  //     default:
  //       break;
  //   }
  // };

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
              Charts
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
        </Grid>
        <Grid container spacing={3} justify="center">
          <Grid item xs={8} md={8}>
            <PyramidChart leads={leads}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ApexChartsView;
