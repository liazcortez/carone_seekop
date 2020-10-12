/* eslint no-lone-blocks: 0 */
/*eslint no-unused-vars: 0*/

import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SimpleDialog from 'src/components/SimpleDialog'
import useUser from 'src/hooks/useUser';
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

const applyFilters = (users, query, filters) => {
  return users.filter(user => {
    let matches = true;

    if (query) {
      const properties = ['name','store','email', 'role'];
      let containsQuery = false;

      properties.forEach(property => {
        if(property !== 'store'){
          if (user[property].toLowerCase().includes(query.toLowerCase())) {
            containsQuery = true;
          }
        }else{
          if(user[property]){
            if (user[property].name.toLowerCase().includes(query.toLowerCase())) {
              containsQuery = true;
            }
            if (user[property].make.name.toLowerCase().includes(query.toLowerCase())) {
              containsQuery = true;
            }
          }
         
        }
        
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach(key => {
      const value = filters[key];

      if (value && user[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (users, page, limit) => {
  return users.slice(page * limit, page * limit + limit);
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

const applySort = (users, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = users.map((el, index) => [el, index]);

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
  sold: {
    'text-transform': 'Capitalize',
    width: '100%',
    border: '1px solid #d0392e',
    color: theme.palette.error.main,
    "&:hover": {
      color: "#d0392e"
    }
  },
  new: {
    'text-transform': 'Capitalize',
    width: '100%',
    border: '1px solid #3d9040',
    color: theme.palette.success.main,
    "&:hover": {
      color: "#3d9040"
    }
  },
  follow: {
    'text-transform': 'Capitalize',
    width: '100%',
    border: '1px solid #e28701',
    color: theme.palette.warning.main,
    "&:hover": {
      color: "#e28701"
    }
  },
  default: {
    'text-transform': 'Capitalize',
    width: '100%'
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

const Results = ({ className, users, ...rest }) => {

  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const { getUsers, deleteUser, loading } = useUser();
  const [multipleDelete, setMultipleDelete] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();
  const [filters, setFilters] = useState({
    hasAcceptedMarketing: null,
    isProspect: null,
    isReturning: null
  });

  useEffect(() => {
  
    if(multipleDelete){

      getUsers();
      setMultipleDelete(false)
    }

    // eslint-disable-next-line
  }, [multipleDelete])

  const handleClose = async (value) => {
    setOpen(false);
    setSelectedValue(value);
    if(value === 'yes'){
      await selectedUsers.map(async user => await deleteUser(user));
      await wait(1000);
      await getUsers();
    }
  };

  const handleDelete =  async () =>{
    setOpen(true);    
  }

  const handleSelectAllUsers = event => {
    setSelectedUsers(
      event.target.checked ? users.map(user => user._id) : []
    );
  };

  const handleSelectOneUser = (event, userId) => {
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers(prevSelected => [...prevSelected, userId]);
    } else {
      setSelectedUsers(prevSelected =>
        prevSelected.filter(id => id !== userId)
      );
    }
  };

   const enableBulkOperations = selectedUsers.length > 0;
  const selectedSomeUsers =
    selectedUsers.length > 0 && selectedUsers.length < users.length;
  const selectedAllUsers = selectedUsers.length === users.length;


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
    setSelectedUsers([]);
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

  const filteredUsers = applyFilters(users, query, filters);
  const sortedUsers = applySort(filteredUsers, sort);
  const paginatedUsers = applyPagination(sortedUsers, page, limit);
 

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
      <div p={2} display="flex" className={classes.containerSync}>
      {
        loading === true ? (
          
          <FontAwesomeIcon className={classes.sync} icon={faSync} spin />
          
        ) : (
          <FontAwesomeIcon className={classes.sync} icon={faSync} onClick={() => { getUsers() }}/>
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
          placeholder="Search users"
          value={query}
          variant="outlined"
        />
       
      </Box>
      { enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllUsers}
              indeterminate={selectedSomeUsers}
              onChange={handleSelectAllUsers}
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
                    checked={selectedAllUsers}
                    indeterminate={selectedSomeUsers}
                    onChange={handleSelectAllUsers}
                  />
                </TableCell>}
                <TableCell>Name</TableCell>
                <TableCell>Store</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                
                {/*<TableCell align="right">Actions</TableCell>*/}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map(user => {
                const isUserSelected = selectedUsers.includes(
                  user._id
                );

                return (
                  <TableRow
                    hover
                    key={user._id}
                    selected={isUserSelected}
                  >
                    {<TableCell padding="checkbox">
                      <Checkbox
                        checked={isUserSelected}
                        onChange={event =>
                          handleSelectOneUser(event, user._id)
                        }
                        value={isUserSelected}
                      />
                      </TableCell>}
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/users/${user._id}`}
                            variant="h6"
                          >
                            {user && user.name ? user.name : 'No Name'}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {user &&  user.store && user.store.make && user.store.make.name ? user.store.make.name + ' ' : 'No Make' }
                      {user &&  user.store && user.store.name ? user.store.name : 'No store'}</TableCell>
                    <TableCell>{user && user.email ? user.email : 'No Email'}</TableCell>
                    <TableCell>
                      {user && user.role ? user.role : 'No Role'}
                    </TableCell>
                    {/*<TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        to={`/app/management/users/${user._id}/edit`}
                      >
                        <SvgIcon fontSize="small">
                          <EditIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        component={RouterLink}
                        to={`/app/management/users/${user._id}`}
                      >
                        <SvgIcon fontSize="small">
                          <ArrowRightIcon />
                        </SvgIcon>
                      </IconButton>
                          </TableCell>*/}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={filteredUsers.length}
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
  users: PropTypes.array.isRequired
};

Results.defaultProps = {
  users: []
};

export default Results;
