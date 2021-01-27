import React, { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { colors } from '@material-ui/core';
import { CapitalizeNames } from 'src/utils/capitalize';
import { useTranslation } from 'react-i18next';
import i18next from 'src/utils/i18next';
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
  makeStyles
} from '@material-ui/core';
import {
  BarChart as BarChartIcon,
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
  Triangle as ModelChartIcon,
  Sidebar as MultiBarIcon,
  Clock as HourIcon,
  File as DocumentIcon,
  UploadCloud as LoadIcon
} from 'react-feather';
import Logo from 'src/components/Logo';
import useAuth from 'src/hooks/useAuth';
import NavItem from './NavItem';

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
  const { t } = useTranslation();
  const loc = useLocation();

  useEffect(() => {
    let language;
    if (localStorage.getItem('i18nextLng')) {
      language = localStorage.getItem('i18nextLng');
    } else {
      language = 'en';
    }
    i18next.changeLanguage(language);
  }, []);

  const rockstarSection = [
    {
      subheader: t('Navbar.Control'),
      items: [
        {
          title: t('Navbar.Control'),
          icon: ControlIcon,
          href:
            loc.pathname === '/app/management/omsLeads'
              ? '/none'
              : '/app/management',

          items: [
            {
              title: t('Navbar.Makes'),
              href: '/app/management/makes',
              icon: MakeIcon
            },
            {
              title: t('Navbar.Stores'),
              href: '/app/management/stores',
              icon: StoreIcon
            },
            {
              title: t('Navbar.Sources'),
              href: '/app/management/sources',
              icon: SourceIcon
            },
            {
              title: t('Navbar.Vehicles'),
              href: '/app/management/vehicles',
              icon: VehicleIcon
            },
            {
              title: t('Navbar.Status'),
              href: '/app/management/status',
              icon: StatusIcon
            },
            {
              title: t('Navbar.Users'),
              href: '/app/management/users',
              icon: UserIcon
            },
            {
              title: t('Navbar.Documents'),
              href: '/app/management/documents',
              icon: DocumentIcon
            },
            {
              title: t('Navbar.Companies'),
              href: '/app/management/companies',
              icon: ModelChartIcon
            },
            {
              title: t('Navbar.LoadLeads'),
              href: '/app/management/loadLeads',
              icon: LoadIcon
            }
          ]
        }
      ]
    }
  ];

  const adminSection = [
    {
      subheader: t('Navbar.Oms'),
      items: [
        {
          title: t('Navbar.Leads'),
          icon: DatabaseIcon,
          href: '/app/management/omsLeads'
        },
        {
          title: t('Navbar.ChartsH'),
          href: '/app/extra/GHighcharts',
          icon: BarChartIcon,
          items: [
            {
              title: t('Navbar.Monthly'),
              icon: SoldChartIcon,
              href: '/app/extra/GHighcharts/GlobalLinear'
            },
            {
              title: t('Navbar.Daily'),
              icon: CalendarIcon,
              href: '/app/extra/GHighcharts/GlobalDaily'
            },
            {
              title: t('Navbar.Hours'),
              icon: HourIcon,
              href: '/app/extra/GHighcharts/GlobalHours'
            },
            {
              title: t('Navbar.Lbs'),
              icon: PyramidChartIcon,
              href: '/app/extra/GHighcharts/GlobalPyramid'
            }
          ]
        }
      ]
    },
    {
      subheader: t('Navbar.QuestLeads'),
      items: [
        {
          title: t('Navbar.Leads'),
          icon: DatabaseIcon,
          href: '/app/management/questLeads'
        },
        {
          title: t('Navbar.ChartsH'),
          href: '/app/extra/QHighcharts',
          icon: BarChartIcon,
          items: [
           
            {
              title: t('Navbar.Monthly'),
              icon: SoldChartIcon,
              href: '/app/extra/QHighcharts/linear'
            },
            {
              title: t('Navbar.Daily'),
              icon: CalendarIcon,
              href: '/app/extra/QHighcharts/daily'
            },
            {
              title: t('Navbar.Models'),
              icon: MultiBarIcon,
              href: '/app/extra/QHighcharts/multiple'
            },
            {
              title: t('Navbar.Hours'),
              icon: HourIcon,
              href: '/app/extra/QHighcharts/hours'
            },
            {
              title: t('Navbar.Lbm'),
              icon: ModelChartIcon,
              href: '/app/extra/QHighcharts/models'
            },
            {
              title: t("Navbar.Lbs"),
              icon: PyramidChartIcon,
              href: '/app/extra/QHighcharts/Pyramid'
            }
          ]
        }
      ]
    },
  ];

  const userSection = [
    {
      subheader: t('Navbar.Oms'),
      items: [
        {
          title: t('Navbar.Leads'),
          icon: DatabaseIcon,
          href: '/app/management/omsLeads'
        }
      ]
    },
    {
      subheader: t('Navbar.QuestLeads'),
      items: [
        {
          title: t('Navbar.Leads'),
          icon: DatabaseIcon,
          href: '/app/management/questLeads'
        },
      ]
    },
  ];

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
                src={
                  user && user.image
                    ? `${process.env.REACT_APP_URL_IMAGE_S3_URL}${user.image}`
                    : ''
                }
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
              {user && user.name ? CapitalizeNames(user.name) : 'None'}
            </Link>
            <Typography variant="body2" color="textSecondary">
              {t('Account.YourTier')}:
              <span className={classes.primaryColor} variant="body2">
                {user && user.role ? ' ' + CapitalizeNames(user.role) : ''}
              </span>
            </Typography>
            {user ? (
              <Typography
                pt={4}
                variant="body2"
                style={{ textTransform: 'capitalize' }}
              >
                {user.role === 'rockstar' || user.role === 'super admin'
                  ? 'Global'
                  : user && user.store && user.store.make
                  ? CapitalizeNames(user.store.make.name) +
                    ' ' +
                    CapitalizeNames(user.store.name)
                  : ''}
              </Typography>
            ) : (
              false
            )}
          </Box>
        </Box>
        <Divider />
       
        {
          user
            ? user.role === 'user'
              ? userSection.map(section => (
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
          : false
        }
        {
          user
          ? user.role === 'admin' || user.role === 'rockstar' || user.role === 'super admin'
          ? adminSection.map(section => (
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
          : false
        }
        {
          user
            ? user.role === 'rockstar' || user.role === 'super admin'
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
          : false
        }

        
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
