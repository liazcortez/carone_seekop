/*eslint no-unused-vars: 0*/


import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useVehicle from 'src/hooks/useVehicle';
import SimpleDialog from 'src/components/SimpleDialog'
import wait from 'src/utils/wait';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import NumberFormat from 'react-number-format'; 
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

const applyFilters = (vehicles, query, filters) => {
  return vehicles.filter(vehicle => {
    let matches = true;

    if (query) {
      const properties = ['model','description', 'modelType', 'year', 'make', 'serie', 'key', 'color', 'inventory'];
      let containsQuery = false;

      properties.forEach(property => {
        if(property !== 'make'){
        if (vehicle[property].toString().toLowerCase().includes(query.toString().toLowerCase())) {
          containsQuery = true;
        }
        }else{
          if (vehicle[property].name.toString().toLowerCase().includes(query.toString().toLowerCase())) {
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

      if (value && vehicle[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (vehicles, page, limit) => {
  return vehicles.slice(page * limit, page * limit + limit);
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

const applySort = (vehicles, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = vehicles.map((el, index) => [el, index]);

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

const Results = ({ className, vehicles, ...rest }) => {

  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const { getVehicles, deleteVehicle, loading } = useVehicle();
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
      await selectedVehicles.map(async vehicle => await deleteVehicle(vehicle));
      await wait(1000);
      await getVehicles();
    }
  };

  const handleDelete =  async () =>{
    setOpen(true);    
  }

  const handleSelectAllVehicles = event => {
    setSelectedVehicles(
      event.target.checked ? vehicles.map(vehicle => vehicle._id) : []
    );
  };

  const handleSelectOneVehicle = (event, vehicleId) => {
    if (!selectedVehicles.includes(vehicleId)) {
      setSelectedVehicles(prevSelected => [...prevSelected, vehicleId]);
    } else {
      setSelectedVehicles(prevSelected =>
        prevSelected.filter(id => id !== vehicleId)
      );
    }
  };

   const enableBulkOperations = selectedVehicles.length > 0;
  const selectedSomeVehicles =
    selectedVehicles.length > 0 && selectedVehicles.length < vehicles.length;
  const selectedAllVehicles = selectedVehicles.length === vehicles.length;

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
    setSelectedVehicles([]);
    setCurrentTab(value);
  };

  const handleQueryChange = event => {
    event.persist();
    setQuery(event.target.value);
  };

  /*
  const handleSortChange = event => {
    event.persist();
    setSort(event.target.value);
  };*/

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = event => {
    setLimit(parseInt(event.target.value));
  };

  const filteredVehicles = applyFilters(vehicles, query, filters);
  const sortedVehicles = applySort(filteredVehicles, sort);
  const paginatedVehicles = applyPagination(sortedVehicles, page, limit);
  
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
      <div p={2} display="flex" className={classes.containerSync}>
      {
        loading === true ? (
          
          <FontAwesomeIcon className={classes.sync} icon={faSync} spin />
          
        ) : (
          <FontAwesomeIcon className={classes.sync} icon={faSync} onClick={() => { getVehicles() }}/>
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
          placeholder="Search vehicles"
          value={query}
          variant="outlined"
        />
       
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllVehicles}
              indeterminate={selectedSomeVehicles}
              onChange={handleSelectAllVehicles}
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
                    checked={selectedAllVehicles}
                    indeterminate={selectedSomeVehicles}
                    onChange={handleSelectAllVehicles}
                  />
                </TableCell>
                <TableCell>Make</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Model Type</TableCell>
                <TableCell>Serie</TableCell>
                <TableCell>Key</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Inventory</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedVehicles.map(vehicle => {
                const isVehicleSelected = selectedVehicles.includes(
                  vehicle._id
                );

                return (
                  <TableRow
                    hover
                    key={vehicle._id}
                    selected={isVehicleSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isVehicleSelected}
                        onChange={event =>
                          handleSelectOneVehicle(event, vehicle._id)
                        }
                        value={isVehicleSelected}
                      />
                    </TableCell>
                    <TableCell>{vehicle && vehicle.make && vehicle.make.name}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/vehicles/${vehicle._id}`}
                            variant="h6"
                          >
                            {vehicle.model}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>{vehicle && vehicle.year}</TableCell>
                    <TableCell>{vehicle && vehicle.modelType}</TableCell>
                    <TableCell>{vehicle && vehicle.serie}</TableCell>
                    <TableCell>{vehicle && vehicle.key}</TableCell>
                    <TableCell>{vehicle && vehicle.color}</TableCell>
                    <TableCell>{vehicle && vehicle.inventory}</TableCell>
                    <TableCell>{vehicle && 
                      <NumberFormat value={vehicle.price} displayType={'text'} thousandSeparator={true} prefix={'$'}/> 
                    }</TableCell>
                    <TableCell>{vehicle && vehicle.description}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={filteredVehicles.length}
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
  vehicles: PropTypes.array.isRequired
};

Results.defaultProps = {
  vehicles: []
};

export default Results;
