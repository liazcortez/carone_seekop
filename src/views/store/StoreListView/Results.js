import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useStore from 'src/hooks/useStore';
import SimpleDialog from 'src/components/SimpleDialog'
import {Capitalize, CapitalizeNames} from 'src/utils/capitalize';
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
import { useTranslation } from 'react-i18next';
import moment from 'moment'

const applyFilters = (stores, query) => {
  return stores.filter(store => {
    let matches = true;

    if (query) {
      const properties = ['name', 'address','make'];
      let containsQuery = false;

      properties.forEach(property => {
        if(property !== 'make'){
          if (store[property] && store[property].toLowerCase().includes(query.toLowerCase())) {
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

    return matches;
  });
};

const applyPagination = (stores, page, limit) => {
  return stores.slice(page * limit, page * limit + limit);
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
  const [selectedStores, setSelectedStores] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const { t } = useTranslation()
  const { getStores, deleteStore, loading } = useStore();
  const [deletedStores, setDeletedStores] = useState(false)
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();

  const handleClose = async (value) => {
    setOpen(false);
    setSelectedValue(value);
    if(value === 'yes'){
      selectedStores.map(store => deleteStore(store));
      setSelectedStores([])
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

  const filteredStores = applyFilters(stores, query);
  const paginatedStores = applyPagination(filteredStores, page, limit);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} all={deletedStores}/>
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
          placeholder={t("Stores.Search")}
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
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllStores}
                    indeterminate={selectedSomeStores}
                    onChange={handleSelectAllStores}
                    onClick={(e)=>{setDeletedStores(true)}}

                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>{t("Stores.Make")}</TableCell>
                <TableCell>{t("Stores.Store")}</TableCell>
                <TableCell>{t("Stores.Address")}</TableCell>
                <TableCell>{t("Stores.Description")}</TableCell>
                <TableCell>{t("Stores.Phone")}</TableCell>
                <TableCell>{t("Stores.CreatedAt")}</TableCell>
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
                        onClick={(e)=>{setDeletedStores(false)}}

                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/stores/${store && store._id}`}
                            variant="h6"
                          >
                            {store && store._id}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>{store.make && CapitalizeNames(store.make.name)}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/stores/${store && store._id}`}
                            variant="h6"
                          >
                            {store && store.name ? CapitalizeNames(store.name) : '- - -'}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>{store && store.address ? Capitalize(store.address) : '- - -'}</TableCell>
                    <TableCell>{store && store.description ? Capitalize(store.description) : '- - -'}</TableCell>
                    <TableCell>{store && store.phone ? store.phone :'- - -' }</TableCell>
                    <TableCell>{store && moment(store.createdAt).format('ll')}</TableCell>
                    
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
