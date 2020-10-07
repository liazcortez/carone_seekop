/* eslint-disable no-use-before-define */
import React, { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { colors } from '@material-ui/core';

import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  Link,
  List,
  ListSubheader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Database as DatabaseIcon,
  Coffee as ControlIcon,
  Facebook as SourceIcon,
  Aperture as MakeIcon,
  Home as StoreIcon,
  Truck as VehicleIcon,
  AlertCircle as StatusIcon,
  User as UserIcon,
  Calendar as CalendarIcon,
  Activity as PyramidChartIcon,
  DollarSign as SoldChartIcon,
  Globe as AllChartIcon,
  Triangle as ModelChartIcon,
  Sidebar as MultiBarIcon,
  Key as SocialAccountIcon,
  List as ListIcon,
  Clock as HourIcon,
  File as DocumentIcon
} from 'react-feather';
import Logo from 'src/components/Logo';
import useAuth from 'src/hooks/useAuth';
import NavItem from './NavItem';

const sectionsAdmin = [
  {
    subheader: 'Main',
    items: [
      {
        title: 'Dashboard',
        icon: PieChartIcon,
        href: '/app/reports/dashboardAdmin'
      },
      {
        title: 'Leads',
        icon: DatabaseIcon,
        href: '/app/management/customers'
      },
      {
        title: 'Calendar',
        icon: CalendarIcon,
        href: '/app/calendar'
      }
    ]
  }
];

const sectionsUser = [
  {
    subheader: 'Main',
    items: [
      {
        title: 'Dashboard',
        icon: PieChartIcon,
        href: '/app/reports/dashboard'
      },
      {
        title: 'Leads',
        icon: DatabaseIcon,
        href: '/app/management/customers'
      },
      {
        title: 'Calendar',
        icon: CalendarIcon,
        href: '/app/calendar'
      }
    ]
  }
];

const sectionsRockstar = [
  {
    subheader: 'Main',
    items: [
      {
        title: 'Dashboard',
        icon: PieChartIcon,
        href: '/app/reports/dashboardRockstar'
      },
      {
        title: 'Leads',
        icon: DatabaseIcon,
        href: '/app/management/customers'
      },
      {
        title: 'Calendar',
        icon: CalendarIcon,
        href: '/app/calendar'
      }
    ]
  },
  {
    subheader: 'Charts',
    items: [
      {
        title: 'Charts',
        href: '/app/extra/charts',
        icon: BarChartIcon,
        items: [
          {
            title: 'Global Report',
            icon: AllChartIcon,
            href: '/app/extra/charts/all'
          },
          {
            title: 'Monthly Comparative',
            icon: SoldChartIcon,
            href: '/app/extra/charts/linear'
          },
          {
            title: 'Stores Report',
            icon: StoreIcon,
            href: '/app/extra/charts/stores'
          },
          {
            title: 'Models Comparative',
            icon: MultiBarIcon,
            href: '/app/extra/charts/multiple'
          },
          {
            title: 'Leads By Models',
            icon: ModelChartIcon,
            href: '/app/extra/charts/models'
          },
          {
            title: 'Leads By Status',
            icon: PyramidChartIcon,
            href: '/app/extra/charts/pyramid'
          },
        ]
      },
      {
        title: 'Charts Highcharts',
        href: '/app/extra/highcharts',
        icon: BarChartIcon,
        items: [
          {
            title: 'Global Report',
            icon: StoreIcon,
            href: '/app/extra/highcharts/all'
          },
          {
            title: 'Monthly Comparative',
            icon: SoldChartIcon,
            href: '/app/extra/highcharts/linear'
          },
          {
            title: 'Daily Monthly Comparative',
            icon: CalendarIcon,
            href: '/app/extra/highcharts/daily'
          },
          {
            title: 'Models Comparative',
            icon: MultiBarIcon,
            href: '/app/extra/highcharts/multiple'
          },
          {
            title: 'Hours Comparative',
            icon: HourIcon,
            href: '/app/extra/highcharts/hours'
          },
          {
            title: 'Leads By Models',
            icon: ModelChartIcon,
            href: '/app/extra/highcharts/models'
          },
          {
            title: 'Leads By Status',
            icon: PyramidChartIcon,
            href: '/app/extra/highcharts/pyramid'
          },
        ]
      }
    ]

  }
];
const rockstarSection = [
  {
    subheader: 'Control Panel',
    items: [
      {
        title: 'Control Panel',
        icon: ControlIcon,
        items: [
          {
            title: 'Makes',
            href: '/app/management/makes',
            icon: MakeIcon
          },
          {
            title: 'Stores',
            href: '/app/management/stores',
            icon: StoreIcon
          },
          {
            title: 'Sources',
            href: '/app/management/sources',
            icon: SourceIcon
          },
          {
            title: 'Vehicle',
            href: '/app/management/vehicles',
            icon: VehicleIcon
          },
          {
            title: 'Status',
            href: '/app/management/status',
            icon: StatusIcon
          },
          {
            title: 'Users',
            href: '/app/management/users',
            icon: UserIcon
          },
          {
            title: 'Documents',
            href: '/app/management/documents',
            icon: DocumentIcon
          },
          {
            title: 'Social Accounts',
            href: '/app/management/socialAccounts',
            icon: SocialAccountIcon
          }
        ]
      }
    ]
  }
];

function renderNavItems({ items, pathname, depth = 0 }) {
  return (
    <List disablePadding>
      {items.reduce(
        (acc, item) => reduceChildRoutes({ acc, item, pathname, depth }),
        []
      )}
    </List>
  );
}

function reduceChildRoutes({ acc, pathname, item, depth }) {
  const key = item.title + depth;

  if (item.items) {
    const open = matchPath(pathname, {
      path: item.href,
      exact: false
    });

    acc.push(
      <NavItem
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        open={Boolean(open)}
        title={item.title}
      >
        {renderNavItems({
          depth: depth + 1,
          pathname,
          items: item.items
        })}
      </NavItem>
    );
  } else {
    acc.push(
      <NavItem
        depth={depth}
        href={item.href}
        icon={item.icon}
        info={item.info}
        key={key}
        title={item.title}
      />
    );
  }

  return acc;
}

const useStyles = makeStyles(theme => ({
  item: {
    display: 'block',
    paddingTop: 0,
    paddingBottom: 0
  },
  itemLeaf: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: colors.grey[500],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%'
  },
  buttonLeaf: {
    color: colors.blueGrey[800],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightRegular,
    '&.depth-0': {
      fontWeight: theme.typography.fontWeightMedium
    }
  },
  icon: {
    color: theme.palette.icon,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  expandIcon: {
    marginLeft: 'auto',
    height: 16,
    width: 16
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto'
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  },
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  },
  primaryColor: {
    color: theme.palette.primary.main
  }
}));

const NavBar = ({ onMobileClose, openMobile, ...rest }) => {
  const classes = useStyles();
  const location = useLocation();
  const { user } = useAuth();
 


  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <PerfectScrollbar options={{ suppressScrollX: true }}>
        <Hidden lgUp>
          <Box p={2} display="flex" justifyContent="center">
            <RouterLink to="/">
              <Logo />
            </RouterLink>
          </Box>
        </Hidden>
        <Box p={2}>
          <Box display="flex" justifyContent="center">
            <RouterLink to="/app/account">
              <Avatar
                alt="User"
                className={classes.avatar}
                src={user ? user.image : ''}
              />
            </RouterLink>
          </Box>
          <Box mt={2} textAlign="center">
            <Link
              component={RouterLink}
              to="/app/account"
              variant="h5"
              color="textPrimary"
              underline="none"
            >
              {user && user.name ? user.name : 'None'}
            </Link>
            <Typography variant="body2" color="textSecondary">
              Your tier:
              <span className={classes.primaryColor} variant="body2">
                {user && user.role
                  ? ' ' + user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : ''}
              </span>
            </Typography>
            {
              user  ? (
                  <Typography 
                  pt={4}
                  variant="body2"
                  style={{textTransform: 'capitalize'}}>
                 
                      {user.role === 'rockstar' || user.role === 'super admin' ? 'Global' : 
                      user && user.store && user.store.make ? user.store.make.name + " " + user.store.name : ''}
                  </Typography>
              ) : false
            }

          
          </Box>
        </Box>
        <Divider />
        {user
          ? user.role === 'rockstar' || user.role === 'super admin'
            ? sectionsRockstar.map(section => (
                <Box p={2} key={Math.random() + Math.random()}>
                  <List
                    key={section.subheader + Math.random()}
                    subheader={
                      <ListSubheader disableGutters disableSticky>
                        {section.subheader}
                      </ListSubheader>
                    }
                  >
                    {renderNavItems({
                      items: section.items,
                      pathname: location.pathname
                    })}
                  </List>
                  {/* <Divider /> */}
                </Box>
              ))
            : false
          : false}

        {user
          ? user.role === 'admin'
            ? sectionsAdmin.map(section => (
                <Box p={2}>
                  <List
                    key={section.subheader + Math.random()}
                    subheader={
                      <ListSubheader disableGutters disableSticky>
                        {section.subheader}
                      </ListSubheader>
                    }
                  >
                    {renderNavItems({
                      items: section.items,
                      pathname: location.pathname
                    })}
                  </List>
                </Box>
              ))
            : false
          : false}

        {user
          ? user.role === 'user'
            ? sectionsUser.map(section => (
                <Box p={2}>
                  <List
                    key={section.subheader + Math.random()}
                    subheader={
                      <ListSubheader disableGutters disableSticky>
                        {section.subheader}
                      </ListSubheader>
                    }
                  >
                    {renderNavItems({
                      items: section.items,
                      pathname: location.pathname
                    })}
                  </List>
                </Box>
              ))
            : false
          : false}

        {/* <Divider /> */}
        {user
          ? user.role === 'rockstar'
            ? rockstarSection.map(section => (
                <Box p={2} key={Math.random()}>
                  <List
                    key={section.subheader + Math.random()}
                    subheader={
                      <ListSubheader disableGutters disableSticky>
                        {section.subheader}
                      </ListSubheader>
                    }
                  >
                    {renderNavItems({
                      items: section.items,
                      pathname: location.pathname
                    })}
                  </List>
                </Box>
              ))
            : false
          : false}
      </PerfectScrollbar>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default NavBar;
