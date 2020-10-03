import React, {
  useRef,
  useState,
  useEffect
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import useLead from 'src/hooks/useLead';
import {
  Breadcrumbs,
  Button,
  Grid,
  Link,
  Menu,
  MenuItem,
  SvgIcon,
  Typography,
  makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Calendar as CalendarIcon } from 'react-feather';
import useAuth from 'src/hooks/useAuth';
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

const useStyles = makeStyles(() => ({
  root: {}
}));

const Header = ({ className, filterChange, ...rest }) => {
  const classes = useStyles();
  const actionRef = useRef(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [timeRange, setTimeRange] = useState(timeRanges[2].text);
  const { getLeadsChart } = useLead();
  const [userRoleSearch, setUserRoleSearch] = useState('');
  const { user } = useAuth();

  useEffect(() => {

    if(user.role && user.store){
      if(user.role === 'admin'){
        getLeadsChart(`?createdAt[gte]=${moment().format('YYYY-MM-DD')}&store=${user.store._id}`);
        setUserRoleSearch(`&store=${user.store._id}`);
      }
      if(user.role === 'user'){
        getLeadsChart(`?createdAt[gte]=${moment().format('YYYY-MM-DD')}&agent=${user._id}`);
        setUserRoleSearch(`&agent=${user._id}`);
      }
      if(user.role === 'rockstar' || user.role === 'super admin'){
        getLeadsChart(`?createdAt[gte]=${moment().format('YYYY-MM-DD')}`);
      }
    }
    //eslint-disable-next-line
  }, [user]);

  const handleChangeTime = (filter) =>{
  
    setTimeRange(filter);
    switch (filter) {
      case 'today':
        getLeadsChart(`?createdAt[gte]=${moment().format('YYYY-MM-DD')}${userRoleSearch}`);
        filterChange('LT','today','today');

        break;
      case 'yesterday':
        getLeadsChart(
          `?createdAt[gt]=${moment()
            .subtract('1', 'days')
            .format('YYYY-MM-DD')}&createdAt[lt]=${moment().format(
            'YYYY-MM-DD'
          )}${userRoleSearch}`
        );
        filterChange('LT','Yesterday','yesterday');

        break;
      case 'month':
        getLeadsChart(`?createdAt[gte]=${moment().startOf('month')._d}${userRoleSearch}`);
        filterChange('D-MMM','this Month','month');

        break;
      case '6month':
        getLeadsChart(
          `?createdAt[gte]=${
            moment()
              .startOf('month')
              .subtract('6', 'months')._d
          }${userRoleSearch}`
        );
        filterChange('MMMM','last 6 months','6month');

        break;
      case 'year':
        getLeadsChart(`?createdAt[gte]=${moment().startOf('year')._d}${userRoleSearch}`);
        filterChange('MMMM', 'the year','year');
        break;

      default:
        break;
    }
  }

  return (
    <Grid
      container
      spacing={3}
      justify="space-between"
      className={clsx(classes.root, className)}
      {...rest}
    >
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
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Reports
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          Here&apos;s what&apos;s happening
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
          {timeRanges.map((_timeRange) => (
            <MenuItem
              key={_timeRange.value}
              onClick={(e) => handleChangeTime(_timeRange.value)}
            >
              {_timeRange.text}
            </MenuItem>
          ))}
        </Menu>
      </Grid>
    </Grid>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
