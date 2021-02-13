import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SimpleDialog from 'src/components/SimpleDialog'
import useUser from 'src/hooks/useUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import {Capitalize, CapitalizeNames} from 'src/utils/capitalize';

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
import { useTranslation } from 'react-i18next';

const applyFilters = (users, query) => {
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

    return matches;
  });
};

const applyPagination = (users, page, limit) => {
  return users.slice(page * limit, page * limit + limit);
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
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const { getUsers, deleteUser, loading } = useUser();
  const [deletedUsers, setDeletedUsers] = useState(false)
  const [multipleDelete, setMultipleDelete] = useState(false);
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation()
  const [selectedValue, setSelectedValue] = React.useState();

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
      selectedUsers.map(user => deleteUser(user));
      setSelectedUsers([])
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

  const handleQueryChange = event => {
    setPage(0)
    event.persist();
    setQuery(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = event => {
    setLimit(parseInt(event.target.value));
  };

  const filteredUsers = applyFilters(users, query);
  const paginatedUsers = applyPagination(filteredUsers, page, limit);
 

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} all={deletedUsers}/>
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
        scrollButtons="auto"
        textColor="secondary"
        value='all'
        variant="scrollable"
      >
        
          <Tab key={0} value={'all'} label={t("Tabs.All")} />
       
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
          placeholder={t("Users.Search")}
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
              {t("Buttons.Delete")}
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
                    onClick={(e)=>{setDeletedUsers(true)}}

                  />
                </TableCell>}
                <TableCell>ID</TableCell>
                <TableCell>{t("Users.Name")}</TableCell>
                <TableCell>{t("Users.Store")}</TableCell>
                <TableCell>{t("Users.Email")}</TableCell>
                <TableCell>{t("Users.Role")}</TableCell>
                <TableCell>{t("Users.CreatedAt")}</TableCell>
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
                        onClick={(e)=>{setDeletedUsers(false)}}

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
                            {user && user._id ? user._id : '- - -'}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/users/${user._id}`}
                            variant="h6"
                          >
                            {user && user.name ? CapitalizeNames(user.name) : '- - -'}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {user &&  user.store && user.store.make && user.store.make.name ? CapitalizeNames(user.store.make.name) + ' ' : '' }
                      {user &&  user.store && user.store.name ? CapitalizeNames(user.store.name) : '- - -'}</TableCell>
                    <TableCell>{user && user.email ? user.email : '- - -'}</TableCell>
                    <TableCell>
                      {user && user.role ? Capitalize(user.role) : '- - -'}
                    </TableCell>
                    <TableCell>{user && moment(user.createdAt).format('ll')}</TableCell>
                   
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
