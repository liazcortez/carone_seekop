/*eslint no-unused-vars: 0*/


import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useStatus from 'src/hooks/useStatus';
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

const applyFilters = (statuses, query, filters) => {
  return statuses.filter(status => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach(property => {
        if (status[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach(key => {
      const value = filters[key];

      if (value && status[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (statuses, page, limit) => {
  return statuses.slice(page * limit, page * limit + limit);
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

const applySort = (statuses, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = statuses.map((el, index) => [el, index]);

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

const Results = ({ className, statuses, ...rest }) => {

  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const { getStatuses, deleteStatus, loading } = useStatus();
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
      await selectedStatuses.map(async status => await deleteStatus(status));
      await wait(1000);
      await getStatuses();
    }
  };

  const handleDelete =  async () =>{
    setOpen(true);    
  }

  const handleSelectAllStatuses = event => {
    setSelectedStatuses(
      event.target.checked ? statuses.map(status => status._id) : []
    );
  };

  const handleSelectOneStatus = (event, statusId) => {
    if (!selectedStatuses.includes(statusId)) {
      setSelectedStatuses(prevSelected => [...prevSelected, statusId]);
    } else {
      setSelectedStatuses(prevSelected =>
        prevSelected.filter(id => id !== statusId)
      );
    }
  };

   const enableBulkOperations = selectedStatuses.length > 0;
  const selectedSomeStatuses =
    selectedStatuses.length > 0 && selectedStatuses.length < statuses.length;
  const selectedAllStatuses = selectedStatuses.length === statuses.length;

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
    setSelectedStatuses([]);
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

  const filteredStatuses = applyFilters(statuses, query, filters);
  const sortedStatuses = applySort(filteredStatuses, sort);
  const paginatedStatuses = applyPagination(sortedStatuses, page, limit);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
      <div p={2} display="flex" className={classes.containerSync}>
      {
        loading === true ? (
          
          <FontAwesomeIcon className={classes.sync} icon={faSync} spin />
          
        ) : (
          <FontAwesomeIcon className={classes.sync} icon={faSync} onClick={() => { getStatuses() }}/>
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
          placeholder="Search statuses"
          value={query}
          variant="outlined"
        />
       
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllStatuses}
              indeterminate={selectedSomeStatuses}
              onChange={handleSelectAllStatuses}
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
                {<TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllStatuses}
                    indeterminate={selectedSomeStatuses}
                    onChange={handleSelectAllStatuses}
                  />
                </TableCell>}
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStatuses.map(status => {
                const isStatusSelected = selectedStatuses.includes(
                  status._id
                );

                return (
                  <TableRow
                    hover
                    key={status && status._id}
                    selected={isStatusSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isStatusSelected}
                        onChange={event =>
                          handleSelectOneStatus(event, status._id)
                        }
                        value={isStatusSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/status/${status && status._id}`}
                            variant="h6"
                          >
                            {status && status.name}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>{status && status.description}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={filteredStatuses.length}
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
  statuses: PropTypes.array.isRequired
};

Results.defaultProps = {
  statuses: []
};

export default Results;
