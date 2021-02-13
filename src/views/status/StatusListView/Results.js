import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useStatus from 'src/hooks/useStatus';
import SimpleDialog from 'src/components/SimpleDialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
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
import moment from 'moment'
import {
  Search as SearchIcon
} from 'react-feather';
import { useTranslation } from 'react-i18next';

const applyFilters = (statuses, query) => {
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

    return matches;
  });
};

const applyPagination = (statuses, page, limit) => {
  return statuses.slice(page * limit, page * limit + limit);
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
    marginBottom: '1em',
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
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const { getStatuses, deleteStatus, loading } = useStatus();
  const [deletedStatus, setDeletedStatus] = useState(false)
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation()
  const [selectedValue, setSelectedValue] = React.useState();

  const handleClose = async (value) => {
    setOpen(false);
    setSelectedValue(value);
    if(value === 'yes'){
      selectedStatuses.map(status => deleteStatus(status));
      setSelectedStatuses([])
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

  const filteredStatuses = applyFilters(statuses, query);
  const paginatedStatuses = applyPagination(filteredStatuses, page, limit);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} all={deletedStatus}/>
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
          placeholder={t("Status.Search")}
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
              {t("Buttons.Delete")}
            </Button>
            
          </div>
        </div>
      )}
      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
          {
            !enableBulkOperations && (
            <TableHead>
              <TableRow>
                {<TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllStatuses}
                    indeterminate={selectedSomeStatuses}
                    onChange={handleSelectAllStatuses}
                    onClick={(e)=>{setDeletedStatus(true)}}

                  />
                </TableCell>}
                <TableCell>ID</TableCell>
                <TableCell>{t("Status.Name")}</TableCell>
                <TableCell>{t("Status.Description")}</TableCell>
                <TableCell>{t("Status.CreatedAt")}</TableCell>

            </TableRow>
            </TableHead>
            )}
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
                        onClick={(e)=>{setDeletedStatus(false)}}

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
                            {status && status._id}
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
                            to={`/app/management/status/${status && status._id}`}
                            variant="h6"
                          >
                            {status && CapitalizeNames(status.name)}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>{status && status.description ? Capitalize(status.description) : '- - -'}</TableCell>
                    <TableCell>{status && moment(status.createdAt).format('ll')}</TableCell>

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
