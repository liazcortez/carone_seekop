import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useVehicle from 'src/hooks/useVehicle';
import SimpleDialog from 'src/components/SimpleDialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Capitalize, CapitalizeNames} from 'src/utils/capitalize';
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
import moment from 'moment'
import {
  Search as SearchIcon
} from 'react-feather';
import { useTranslation } from 'react-i18next';

const applyFilters = (vehicles, query) => {
  return vehicles.filter(vehicle => {
    let matches = true;

    if (query) {
      const properties = ['model','description', 'modelType', 'make'];
      let containsQuery = false;

      properties.forEach(property => {
        if(property !== 'make'){
        if (vehicle[property] && vehicle[property].toString().toLowerCase().includes(query.toString().toLowerCase())) {
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

    return matches;
  });
};

const applyPagination = (vehicles, page, limit) => {
  return vehicles.slice(page * limit, page * limit + limit);
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
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const { t } = useTranslation()
  const { getVehicles, deleteVehicle, loading } = useVehicle();
  const [deletedVehicles, setDeletedVehicles] = useState(false)
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();

  const handleClose = async (value) => {
    setOpen(false);
    setSelectedValue(value);
    if(value === 'yes'){
      selectedVehicles.map(vehicle => deleteVehicle(vehicle));
      setSelectedVehicles([])
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

  const filteredVehicles = applyFilters(vehicles, query);
  const paginatedVehicles = applyPagination(filteredVehicles, page, limit);
  
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} all={deletedVehicles}/>
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
          placeholder={t("Vehicles.Search")}
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
                    checked={selectedAllVehicles}
                    indeterminate={selectedSomeVehicles}
                    onChange={handleSelectAllVehicles}
                    onClick={(e)=>{setDeletedVehicles(true)}}

                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>{t("Vehicles.Make")}</TableCell>
                <TableCell>{t("Vehicles.Model")}</TableCell>
                <TableCell>{t("Vehicles.ModelType")}</TableCell>
                <TableCell>{t("Vehicles.Description")}</TableCell>
                <TableCell>{t("Vehicles.CreatedAt")}</TableCell>

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
                        onClick={(e)=>{setDeletedVehicles(false)}}

                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/vehicles/${vehicle._id}`}
                            variant="h6"
                          >
                            {vehicle._id}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>{vehicle && vehicle.make && Capitalize(vehicle.make.name)}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/vehicles/${vehicle._id}`}
                            variant="h6"
                          >
                            {CapitalizeNames(vehicle.model)}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>{vehicle && Capitalize(vehicle.modelType)}</TableCell>
                    <TableCell>{vehicle && vehicle.description ? Capitalize(vehicle.description) : '- - -'}</TableCell>
                    <TableCell>{vehicle && moment(vehicle.createdAt).format('ll')}</TableCell>
                    
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

