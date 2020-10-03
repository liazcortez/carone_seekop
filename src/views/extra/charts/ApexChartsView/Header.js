import React, {
    useRef,
    useState
  } from 'react';
  import { Link as RouterLink } from 'react-router-dom';
  import PropTypes from 'prop-types';
  import clsx from 'clsx';
  import moment from 'moment';
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
  import useLead from 'src/hooks/useLead';
  import generateLinearChart from 'src/utils/generateLinearChart';
  
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
  
  const Header = ({ className, ...rest }) => {
    const classes = useStyles();
    const actionRef = useRef(null);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [timeRange, setTimeRange] = useState(timeRanges[0].text);
    const [searchBy, setSearchBy] = useState(moment());
    const { getLeadsChart, leads } = useLead();
    const [chartData, setChartData] = useState();

    const handleChangeTime = (filter) =>{
      
      setTimeRange(filter)
      
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
            <Typography
              variant="body1"
              color="textPrimary"
            >
              Charts
            </Typography>
          </Breadcrumbs>
          <Typography
            variant="h3"
            color="textPrimary"
          >
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
  