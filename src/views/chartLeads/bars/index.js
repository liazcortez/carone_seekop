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
  Typography
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Page from 'src/components/Page';
//import AreaChart from './AreaChart';
import LineChart from './BarChart';
//import RadialChart from './RadialChart';
import useLead from 'src/hooks/useLead';
import moment from 'moment';
import { Calendar as CalendarIcon } from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

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
  const { leads, getLeadsChart } = useLead();
  const [timeRange, setTimeRange] = useState(timeRanges[2].text);
  const actionRef = useRef(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('LT');

  useEffect(() => {
    getLeadsChart(`?createdAt[gte]=${moment().startOf('month')._d}`);

    //eslint-disable-next-line
  }, []);

  const handleChangeTime = filter => {
    setTimeRange(filter);
    setFilter();
    switch (filter) {
      case 'today':
        getLeadsChart(`?createdAt[gte]=${moment().format('YYYY-MM-DD')}`);
        setFilter('LT');

        break;
      case 'yesterday':
        getLeadsChart(
          `?createdAt[gt]=${moment()
            .subtract('1', 'days')
            .format('YYYY-MM-DD')}&createdAt[lt]=${moment().format(
            'YYYY-MM-DD'
          )}`
        );
        setFilter('LT');

        break;
      case 'month':
        getLeadsChart(`?createdAt[gte]=${moment().startOf('month')._d}`);
        setFilter('D-MMM');

        break;
      case '6month':
        getLeadsChart(
          `?createdAt[gte]=${
            moment()
              .startOf('month')
              .subtract('6', 'months')._d
          }`
        );
        setFilter('MMMM');

        break;
      case 'year':
        getLeadsChart(`?createdAt[gte]=${moment().startOf('year')._d}`);
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

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <LineChart leads={leads} filter={filter} />
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
