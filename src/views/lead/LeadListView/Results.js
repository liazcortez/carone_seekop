/*eslint no-unused-vars: 0*/
/* eslint no-lone-blocks: 0 */

import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useLead from 'src/hooks/useLead';
import wait from 'src/utils/wait';
import SimpleDialog from 'src/components/SimpleDialog'
import useAuth from 'src/hooks/useAuth';
import moment from 'moment';
import useStatus from 'src/hooks/useStatus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import Label from 'src/components/Label';
import NumberFormat from 'react-number-format'
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
  IconButton,
  Tabs,
  TextField,
  makeStyles,
  Tooltip,
  Button,
  Checkbox
} from '@material-ui/core';
import {
  Search as SearchIcon,
  CheckSquare as CheckIcon
} from 'react-feather';

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

const applyFilters = (leads, query, filters) => {
  return leads.filter(lead => {
    let matches = true;

    if (query) {
      const properties = ['name', 'vehicle', 'email', 'source', 'createdAt', 'rating', 'status'];
      let containsQuery = false;

      properties.forEach(property => {
      if(property !== 'vehicle' && property !== 'source' && property !== 'createdAt' && property !== 'status'){

        if (lead[property].toString().toLowerCase().includes(query.toString().toLowerCase())) {
          containsQuery = true;
        }

      }else{

        if(property === 'createdAt'){
          const date = moment(lead[property]).format('LL');
          if (date.toString().toLowerCase().includes(query.toString().toLowerCase())) {
            containsQuery = true;
          }
        }
        if(property === 'vehicle'){
          if (lead[property].make.name.toString().toLowerCase().includes(query.toString().toLowerCase())) {
            containsQuery = true;
          }
          if (lead[property].model.toString().toLowerCase().includes(query.toString().toLowerCase())) {
            containsQuery = true;
          }
        }
        if(property === 'source'){
          if (lead[property].name.toString().toLowerCase().includes(query.toString().toLowerCase())) {
            containsQuery = true;
          }
        }
        if(property === 'status'){
          if (lead[property].name.toString().toLowerCase().includes(query.toString().toLowerCase())) {
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

      if (value && lead[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};


const applyPagination = (leads, page, limit) => {
  return leads.slice(page * limit, page * limit + limit);
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

const applySort = (leads, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = leads.map((el, index) => [el, index]);

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
  greenCheck: {
    color: theme.palette.success.main
  },
  capitalize: {
    'text-transform': 'Capitalize',
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

const Results = ({ className, leads, ...rest }) => {

  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const { getLeads, deleteLead, getLeadsByStatus, loading, getLeadsByStore, getLeadsByUser } = useLead();
  const [multipleDelete, setMultipleDelete] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();
  const { user } = useAuth();
  const { statuses, getStatuses } = useStatus();
  const [filters, setFilters] = useState({
    hasAcceptedMarketing: null,
    isProspect: null,
    isReturning: null
  });

  useEffect(() => {
    if(multipleDelete){
      getLeads();
      setMultipleDelete(false)
    }
    // eslint-disable-next-line
  }, [multipleDelete])

  useEffect(() => {
    getStatuses();
    // eslint-disable-next-line
  }, [])

  const handleClose = async (value) => {
    setOpen(false);
    setSelectedValue(value);
    if(value === 'yes'){
      
      await selectedLeads.map(async lead => await deleteLead(lead));
      await wait(1000);
      await getLeads();
    }
  };

  const handleDelete =  async () =>{
    setOpen(true);    
  }

  const handleSelectAllLeads = event => {
    setSelectedLeads(
      event.target.checked ? leads.map(lead => lead._id) : []
    );
  };

  const handleSelectOneLead = (event, leadId) => {
    if (!selectedLeads.includes(leadId)) {
      setSelectedLeads(prevSelected => [...prevSelected, leadId]);
    } else {
      setSelectedLeads(prevSelected =>
        prevSelected.filter(id => id !== leadId)
      );
    }
  };

  const enableBulkOperations = selectedLeads.length > 0;
  const selectedSomeLeads =
    selectedLeads.length > 0 && selectedLeads.length < leads.length;
  const selectedAllLeads = selectedLeads.length === leads.length;


  const handleTabsChange = (event, value) => {
    setPage(0)

    const updatedFilters = {
      ...filters,
      hasAcceptedMarketing: null,
      isProspect: null,
      isReturning: null
    };
    
    if(value === 'all'){
      if(user){
        if(user.role === 'rockstar' || user.role === 'super admin'){
          getLeads();
        }if(user.role === 'admin'){
          getLeadsByStore(user.store._id, '');
        }
        if(user.role === 'user'){
          getLeadsByUser(user._id, '');
        }
      }
    }else{
      if(user){
        if(user.role === 'rockstar' || user.role === 'super admin'){
          getLeadsByStatus(value)
        }if(user.role === 'admin'){
          getLeadsByStore(user.store._id, value);
        }
        if(user.role === 'user'){
          getLeadsByUser(user._id, value);
        }
      }
    }
    setFilters(updatedFilters);
    setCurrentTab(value);
  };

  const handleReload = () => {
    if(currentTab === 'all'){
      if(user){
        if(user.role === 'rockstar' || user.role === 'super admin'){
          getLeads();
        }
        if(user.role === 'admin'){
          getLeadsByStore(user.store._id, '');
        }
        if(user.role=== 'user'){
          getLeadsByUser(user._id, '');
        }
      }
    }else{
      if(user){
        if(user.role === 'rockstar' || user.role === 'super admin'){
          getLeadsByStatus(currentTab)
        }if(user.role === 'admin'){
          getLeadsByStore(user.store._id, currentTab);
        }
        if(user.role === 'user'){
          getLeadsByUser(user._id, currentTab)
        }
      }
    }
  }

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

  const filteredLeads = applyFilters(leads, query, filters);
  const sortedLeads = applySort(filteredLeads, sort);
  const paginatedLeads = applyPagination(sortedLeads, page, limit);
  
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
      <div p={2} display="flex" className={classes.containerSync}>
      {
        loading === true ? (
          
          <FontAwesomeIcon className={classes.sync} icon={faSync} spin />
          
        ) : (
          <FontAwesomeIcon className={classes.sync} icon={faSync} onClick={handleReload}/>
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
        <Tab key={'all'} value={'all'} label={'All'} />

        {statuses && statuses.map(status => (
          status.name === 'new' ?
            <Tab key={status._id} value={status._id} label={status.name} /> : false
        ))}
        {statuses && statuses.map(status => (
          status.name === 'documentation' ?
            <Tab key={status._id} value={status._id} label={status.name} /> : false
        ))}
        {statuses && statuses.map(status => (
          status.name === 'sold' ?
            <Tab key={status._id} value={status._id} label={status.name} /> : false
        ))}

        <Tab key={'hot'} value={'temperature.hot'} label={'Hot'} /> 
        <Tab key={'warm'} value={'temperature.warm'} label={'Warm'} />
        <Tab key={'cold'} value={'temperature.cold'} label={'Cold'} />
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
          placeholder="Search leads"
          value={query}
          variant="outlined"
        />
       
      </Box>
      { enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllLeads}
              indeterminate={selectedSomeLeads}
              onChange={handleSelectAllLeads}
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
                {user && user.role && user.role === 'rockstar' ? (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllLeads}
                    indeterminate={selectedSomeLeads}
                    onChange={handleSelectAllLeads}
                  />
                </TableCell>
                ): false}
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Make</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Down Payment</TableCell>
                <TableCell>Timeframe</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Assigned</TableCell>
                <TableCell>Temperature</TableCell>
                <TableCell>Status</TableCell>
                {/*<TableCell align="right">Actions</TableCell>*/}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedLeads.map(lead => {
                const isLeadSelected = selectedLeads.includes(
                  lead._id
                );

                return (
                  <TableRow
                    hover
                    key={lead._id}
                    selected={isLeadSelected}
                  >
                    {user && user.role && user.role === 'rockstar' ? (<TableCell padding="checkbox">
                      <Checkbox
                        checked={isLeadSelected}
                        onChange={event =>
                          handleSelectOneLead(event, lead._id)
                        }
                        value={isLeadSelected}
                      />
                    </TableCell>) : false}
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/leads/${lead._id}`}
                            variant="h6"
                          >
                            {lead && lead.name ? lead.name : 'No Name'}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>{lead && lead.email ? lead.email : 'None'}</TableCell>
                    <TableCell>
                    <p>{lead && lead.phone ? lead.phone : 'None'}</p>{lead && lead.phone2 ? lead.phone2 : 'None'}
                    </TableCell>
                    <TableCell>
                      {lead && lead.vehicle && lead.vehicle.make && lead.vehicle.make.name ? lead.vehicle.make.name : 'None'}
                    </TableCell>
                    <TableCell>
                      {lead && lead.vehicle && lead.vehicle.model ? lead.vehicle.model : 'None'}
                    </TableCell>
                    <TableCell>
                      {lead && lead.vehicle && lead.vehicle.year ? lead.vehicle.year : 'None'}
                    </TableCell>
                    <TableCell>   
                        {lead && lead.source && lead.source.name ? lead.source.name : 'None'}                
                    </TableCell>
                    <TableCell>   
                        {lead && lead.downPayment ? 
                          <NumberFormat value={lead.downPayment} displayType={'text'} thousandSeparator={true} prefix={'$'}/> : 'None'
                        }                
                    </TableCell>
                    <TableCell>   
                        
                        {lead && lead.timeFrame && lead.timeFrame ?
                        (
                          moment(lead.timeFrame).isSame(moment(), 'day') ? moment(lead.timeFrame).calendar() :
                          moment(lead.timeFrame).diff(moment(), 'days') >= 1  && 
                          moment(lead.timeFrame).diff(moment(), 'days') < 8 ? moment(lead.timeFrame).calendar() : 
                          moment(lead.timeFrame).format('ll')
                        ): 'None'
                        } 
                    </TableCell>
                    <TableCell>   
                        {lead && lead.createdAt ? moment(lead.createdAt).format('ll') : 'None'}                
                    </TableCell>
                    <TableCell>   
                        {lead && lead.agent && lead.agent.name ? lead.agent.name : 'None'}                
                    </TableCell>
                    <TableCell>
                        
                        <Label
                          className={classes.capitalize}
                          color={lead && lead.rating && 
                            lead.rating === 'hot' ? 'error' :
                            lead.rating === 'warm' ? 'warning' : 
                            lead.rating === 'cold' ? 'blue' : 'primary'}
                        >   
                        {lead && lead.rating && lead.rating ? lead.rating : ''}
                        </Label>
                  </TableCell>
                    <TableCell>
                        
                          <Label
                            className={classes.capitalize}
                            color={lead && lead.status && 
                              lead.status.name === 'sold' ? 'error' :
                              lead.status.name === 'documentation' ? 'warning' : 
                              lead.status.name === 'new' ? 'success' : 'primary'}
                          >   
                          {lead && lead.status && lead.status.name ? lead.status.name : ''}
                          </Label>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={filteredLeads.length}

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
  leads: PropTypes.array.isRequired
};

Results.defaultProps = {
  leads: []
};

export default Results;

