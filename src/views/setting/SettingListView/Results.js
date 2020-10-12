/*eslint no-unused-vars: 0*/


import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SimpleDialog from 'src/components/SimpleDialog'
import useSetting from 'src/hooks/useSetting';
import wait from 'src/utils/wait';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import NumberFormat from 'react-number-format';

import {
  Box,
  Card,
  Divider,
  Typography,
  InputAdornment,
  Link,
  SvgIcon,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  makeStyles,
  Button,
  Checkbox
} from '@material-ui/core';
import {
  Search as SearchIcon,
  Download as DownloadIcon
} from 'react-feather';

const tabs = [
  {
    value: 'all',
    label: 'All'
  }
];

const sortOptions = [
  {
    value: 'updatedAt|desc',
    label: 'Last update (newest first)'
  },
  {
    value: 'updatedAt|asc',
    label: 'Last update (oldest first)'
  },
  {
    value: 'orders|desc',
    label: 'Total orders (high to low)'
  },
  {
    value: 'orders|asc',
    label: 'Total orders (low to high)'
  }
];

const applyFilters = (settings, query, filters) => {
  return settings.filter(setting => {
    let matches = true;

    if (query) {
      const properties = ['store','createdAt'];
      let containsQuery = false;

      properties.forEach(property => {
      
        if(property === 'store'){
          if (setting[property].make.name.toLowerCase().includes(query.toLowerCase())) {
            containsQuery = true;
          }
          if (setting[property].name.toLowerCase().includes(query.toLowerCase())) {
            containsQuery = true;
          }
        }
        if(property === 'createdAt'){
          const date = moment(setting[property]).format('LL');
          if (date.toString().toLowerCase().includes(query.toString().toLowerCase())) {
            containsQuery = true;
          }
        }
        
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach(key => {
      const value = filters[key];

      if (value && setting[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (settings, page, limit) => {
  return settings.slice(page * limit, page * limit + limit);
};

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const applySort = (settings, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = settings.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  return stabilizedThis.map(el => el[0]);
};

const useStyles = makeStyles(theme => ({
  root: {},
  queryField: {
    width: 500
  },
  bulkOperations: {
    position: 'relative'
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 6,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.default
  },
  bulkAction: {
    marginLeft: theme.spacing(2)
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  },
  sync: {
    padding: '5px',
    fontSize: '30px',
    cursor: 'pointer',
    right: 30,
    marginTop: 10
  },
  containerSync: {
    float: 'right',
    paddingRight: 10
  },
  download: {
    color: theme.palette.text.primary
  }
}));

const Results = ({ className, settings, ...rest }) => {

  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedSettings, setSelectedSettings] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const { getSettings, deleteSetting, loading } = useSetting();
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();
  const [filters, setFilters] = useState({
    hasAcceptedMarketing: null,
    isProspect: null,
    isReturning: null
  });

  const handleClose = async (value) => {
    setOpen(false);
    setSelectedValue(value);
    if(value === 'yes'){
      await selectedSettings.map(async setting => await deleteSetting(setting));
      await wait(1000);
      await getSettings();
    }
  };

  const handleDelete =  async () =>{
    setOpen(true);    
  }

  const handleSelectAllSettings = event => {
    setSelectedSettings(
      event.target.checked ? settings.map(setting => setting._id) : []
    );
  };

  const handleSelectOneSetting = (event, settingId) => {
    if (!selectedSettings.includes(settingId)) {
      setSelectedSettings(prevSelected => [...prevSelected, settingId]);
    } else {
      setSelectedSettings(prevSelected =>
        prevSelected.filter(id => id !== settingId)
      );
    }
  };

   const enableBulkOperations = selectedSettings.length > 0;
  const selectedSomeSettings =
    selectedSettings.length > 0 && selectedSettings.length < settings.length;
  const selectedAllSettings = selectedSettings.length === settings.length;

  const handleTabsChange = (event, value) => {
    setPage(0)

    const updatedFilters = {
      ...filters,
      hasAcceptedMarketing: null,
      isProspect: null,
      isReturning: null
    };

    if (value !== 'all') {
      updatedFilters[value] = true;
    }

    setFilters(updatedFilters);
    setSelectedSettings([]);
    setCurrentTab(value);
  };

  const handleQueryChange = event => {
    event.persist();
    setQuery(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = event => {
    setLimit(parseInt(event.target.value));
  };

  const filteredSettings = applyFilters(settings, query, filters);
  const sortedSettings = applySort(filteredSettings, sort);
  const paginatedSettings = applyPagination(sortedSettings, page, limit);
  
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
      <div p={2} display="flex" className={classes.containerSync}>
      {
        loading === true ? (
          
          <FontAwesomeIcon className={classes.sync} icon={faSync} spin />
          
        ) : (
          <FontAwesomeIcon className={classes.sync} icon={faSync} onClick={() => { getSettings() }}/>
        )
      }

      </div>    
      <Tabs
        onChange={handleTabsChange}
        scrollButtons="auto"
        textColor="secondary"
        value={currentTab}
        variant="scrollable"
      >
        {tabs.map(tab => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
        
      </Tabs>
      <Divider />
      <Box p={2} minHeight={56} display="flex" alignItems="center">
        <TextField
          className={classes.queryField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon fontSize="small" color="action">
                  <SearchIcon />
                </SvgIcon>
              </InputAdornment>
            )
          }}
          onChange={handleQueryChange}
          placeholder="Search settings"
          value={query}
          variant="outlined"
        />
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllSettings}
              indeterminate={selectedSomeSettings}
              onChange={handleSelectAllSettings}
            />
            <Button variant="outlined" className={classes.bulkAction} onClick={handleDelete}>
              Delete
            </Button>
           
          </div>
        </div>
      )}
      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllSettings}
                    indeterminate={selectedSomeSettings}
                    onChange={handleSelectAllSettings}
                  />
                </TableCell>
                <TableCell>Store</TableCell>
                <TableCell>Cold</TableCell>
                <TableCell>Warm</TableCell>
                <TableCell>Hot</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSettings.map(setting => {
                const isSettingSelected = selectedSettings.includes(
                  setting._id
                );

                return (
                  <TableRow
                    hover
                    key={setting._id}
                    selected={isSettingSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSettingSelected}
                        onChange={event =>
                          handleSelectOneSetting(event, setting._id)
                        }
                        value={isSettingSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/settings/${setting._id}`}
                            variant="h6"
                          >
                            {setting && setting.store && setting.store.make && setting.store.make.name ? setting.store.make.name + ' ' + setting.store.name : ''} 
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>
                        Time: +{setting.cold.time} months<br/>
                        Down Payment: -<NumberFormat value={setting.cold.downPayment} displayType={'text'} thousandSeparator={true} prefix={'$'}/> 
                    </TableCell>
                    <TableCell>
                        Time: {setting.warm.time} months<br/>
                        Down Payment: <NumberFormat value={setting.warm.downPayment} displayType={'text'} thousandSeparator={true} prefix={'$'}/> 
                    </TableCell>
                    <TableCell>
                        Time: {setting.hot.time} months<br/>
                        Down Payment: +<NumberFormat value={setting.hot.downPayment} displayType={'text'} thousandSeparator={true} prefix={'$'}/> 
                    </TableCell>
                      <TableCell>{moment(setting.createdAt).format('ll')}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={filteredSettings.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  settings: PropTypes.array.isRequired
};

Results.defaultProps = {
  settings: []
};

export default Results;
