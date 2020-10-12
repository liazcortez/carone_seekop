/*eslint no-unused-vars: 0*/


import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SimpleDialog from 'src/components/SimpleDialog'
import useSocialAccount from 'src/hooks/useSocialAccount';
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

const applyFilters = (socialAccounts, query, filters) => {
  return socialAccounts.filter(socialAccount => {
    let matches = true;

    if (query) {
      const properties = ['name', 'account', 'category'];
      let containsQuery = false;

      properties.forEach(property => {
        if (socialAccount[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach(key => {
      const value = filters[key];

      if (value && socialAccount[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (socialAccounts, page, limit) => {
  return socialAccounts.slice(page * limit, page * limit + limit);
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

const applySort = (socialAccounts, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = socialAccounts.map((el, index) => [el, index]);

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

const Results = ({ className, socialAccounts, ...rest }) => {

  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedSocialAccounts, setSelectedSocialAccounts] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const { getSocialAccounts, deleteSocialAccount, loading } = useSocialAccount();
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
      await selectedSocialAccounts.map(async socialAccount => await deleteSocialAccount(socialAccount));
      await wait(1000);
      await getSocialAccounts();
    }
  };

  const handleDelete =  async () =>{
    setOpen(true);    
  }

  const handleSelectAllSocialAccounts = event => {
    setSelectedSocialAccounts(
      event.target.checked ? socialAccounts.map(socialAccount => socialAccount._id) : []
    );
  };

  const handleSelectOneSocialAccount = (event, socialAccountId) => {
    if (!selectedSocialAccounts.includes(socialAccountId)) {
      setSelectedSocialAccounts(prevSelected => [...prevSelected, socialAccountId]);
    } else {
      setSelectedSocialAccounts(prevSelected =>
        prevSelected.filter(id => id !== socialAccountId)
      );
    }
  };

   const enableBulkOperations = selectedSocialAccounts.length > 0;
  const selectedSomeSocialAccounts =
    selectedSocialAccounts.length > 0 && selectedSocialAccounts.length < socialAccounts.length;
  const selectedAllSocialAccounts = selectedSocialAccounts.length === socialAccounts.length;

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
    setSelectedSocialAccounts([]);
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

  const filteredSocialAccounts = applyFilters(socialAccounts, query, filters);
  const sortedSocialAccounts = applySort(filteredSocialAccounts, sort);
  const paginatedSocialAccounts = applyPagination(sortedSocialAccounts, page, limit);
  
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
      <div p={2} display="flex" className={classes.containerSync}>
      {
        loading === true ? (
          
          <FontAwesomeIcon className={classes.sync} icon={faSync} spin />
          
        ) : (
          <FontAwesomeIcon className={classes.sync} icon={faSync} onClick={() => { getSocialAccounts() }}/>
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
          placeholder="Search socialAccounts"
          value={query}
          variant="outlined"
        />
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllSocialAccounts}
              indeterminate={selectedSomeSocialAccounts}
              onChange={handleSelectAllSocialAccounts}
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
                    checked={selectedAllSocialAccounts}
                    indeterminate={selectedSomeSocialAccounts}
                    onChange={handleSelectAllSocialAccounts}
                  />
                </TableCell>
                <TableCell>Store</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Store</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSocialAccounts.map(socialAccount => {
                const isSocialAccountSelected = selectedSocialAccounts.includes(
                  socialAccount._id
                );

                return (
                  <TableRow
                    hover
                    key={socialAccount._id}
                    selected={isSocialAccountSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSocialAccountSelected}
                        onChange={event =>
                          handleSelectOneSocialAccount(event, socialAccount._id)
                        }
                        value={isSocialAccountSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/socialAccounts/${socialAccount._id}`}
                            variant="h6"
                          >
                            {socialAccount.name}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>{socialAccount && socialAccount.account}</TableCell>
                    <TableCell>{socialAccount && socialAccount.category}</TableCell>
                    <TableCell>{socialAccount && socialAccount.store && socialAccount.store.make && (socialAccount.store.make.name + ' ' + socialAccount.store.name)}</TableCell>
                  
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={filteredSocialAccounts.length}
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
  socialAccounts: PropTypes.array.isRequired
};

Results.defaultProps = {
  socialAccounts: []
};

export default Results;
