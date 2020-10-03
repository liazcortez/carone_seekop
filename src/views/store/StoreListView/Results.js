/*eslint no-unused-vars: 0*/

import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useStore from 'src/hooks/useStore';
import SimpleDialog from 'src/components/SimpleDialog'
import wait from 'src/utils/wait';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import {
  Box,
  Card,
  Divider,
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
  Search as SearchIcon
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

const applyFilters = (stores, query, filters) => {
  return stores.filter(store => {
    let matches = true;

    if (query) {
      const properties = ['name', 'address','make'];
      let containsQuery = false;

      properties.forEach(property => {
        if(property !== 'make'){
          if (store[property].toLowerCase().includes(query.toLowerCase())) {
            containsQuery = true;
          }
        }else{
          if (store[property].name.toLowerCase().includes(query.toLowerCase())) {
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

      if (value && store[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (stores, page, limit) => {
  return stores.slice(page * limit, page * limit + limit);
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

const applySort = (stores, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = stores.map((el, index) => [el, index]);

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
  }
}));

const Results = ({ className, stores, ...rest }) => {

  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedStores, setSelectedStores] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const { getStores, deleteStore, loading } = useStore();
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
      await selectedStores.map(async store => await deleteStore(store));
    await wait(1000);
    await getStores();
    }
  };

  const handleDelete =  async () =>{
    setOpen(true);    
  }


  const handleSelectAllStores = event => {
    setSelectedStores(
      event.target.checked ? stores.map(store => store._id) : []
    );
  };

  const handleSelectOneStore = (event, storeId) => {
    if (!selectedStores.includes(storeId)) {
      setSelectedStores(prevSelected => [...prevSelected, storeId]);
    } else {
      setSelectedStores(prevSelected =>
        prevSelected.filter(id => id !== storeId)
      );
    }
  };

   const enableBulkOperations = selectedStores.length > 0;
  const selectedSomeStores =
    selectedStores.length > 0 && selectedStores.length < stores.length;
  const selectedAllStores = selectedStores.length === stores.length;

  const handleTabsChange = (event, value) => {
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
    setSelectedStores([]);
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

  const filteredStores = applyFilters(stores, query, filters);
  const sortedStores = applySort(filteredStores, sort);
  const paginatedStores = applyPagination(sortedStores, page, limit);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
      <div p={2} display="flex" className={classes.containerSync}>
      {
        loading === true ? (
          
          <FontAwesomeIcon className={classes.sync} icon={faSync} spin />
          
        ) : (
          <FontAwesomeIcon className={classes.sync} icon={faSync} onClick={() => { getStores() }}/>
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
          placeholder="Search stores"
          value={query}
          variant="outlined"
        />
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllStores}
              indeterminate={selectedSomeStores}
              onChange={handleSelectAllStores}
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
                    checked={selectedAllStores}
                    indeterminate={selectedSomeStores}
                    onChange={handleSelectAllStores}
                  />
                </TableCell>
                <TableCell>Make</TableCell>
                <TableCell>Store</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Phone</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStores.map(store => {
                const isStoreSelected = selectedStores.includes(
                  store._id
                );

                return (
                  <TableRow
                    hover
                    key={store && store._id}
                    selected={isStoreSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isStoreSelected}
                        onChange={event =>
                          handleSelectOneStore(event, store._id)
                        }
                        value={isStoreSelected}
                      />
                    </TableCell>
                    <TableCell>{store.make && store.make.name}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/stores/${store && store._id}`}
                            variant="h6"
                          >
                            {store && store.name}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>{store && store.address}</TableCell>
                    <TableCell>{store && store.description}</TableCell>
                    <TableCell>{store && store.phone }</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={filteredStores.length}
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
  stores: PropTypes.array.isRequired
};

Results.defaultProps = {
  stores: []
};

export default Results;
