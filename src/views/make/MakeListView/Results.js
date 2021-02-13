import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useMake from 'src/hooks/useMake';
import SimpleDialog from 'src/components/SimpleDialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
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
  Checkbox,
} from '@material-ui/core';
import {
  Search as SearchIcon
} from 'react-feather';

import moment from 'moment'

const applyFilters = (makes, query, filters) => {
  return makes.filter(make => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach(property => {
        if (make[property].toLowerCase().includes(query.toLowerCase())) {
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

const applyPagination = (makes, page, limit) => {
  return makes.slice(page * limit, page * limit + limit);
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

const Results = ({ className, makes, ...rest }) => {

  const classes = useStyles();
  const [selectedMakes, setSelectedMakes] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const { t } = useTranslation();
  const [deletedMakes, setDeletedMakes] = useState(false)
  const [query, setQuery] = useState('');
  const { deleteMake, getMakes, loading } = useMake();
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();

  const handleClose = async (value) => {
    setOpen(false);
    setSelectedValue(value);
    if(value === 'yes'){
      selectedMakes.map(make => deleteMake(make));
      setSelectedMakes([])
    }
  };

  const handleDelete =  async () =>{
    setOpen(true);    
  }

  const handleSelectAllMakes = event => {
    setSelectedMakes(
      event.target.checked ? makes.map(make => make._id) : []
    );
  };

  const handleSelectOneMake = (event, makeId) => {
    if (!selectedMakes.includes(makeId)) {
      setSelectedMakes(prevSelected => [...prevSelected, makeId]);
    } else {
      setSelectedMakes(prevSelected =>
        prevSelected.filter(id => id !== makeId)
      );
    }
  };

  const enableBulkOperations = selectedMakes.length > 0;
  const selectedSomeMakes =
    selectedMakes.length > 0 && selectedMakes.length < makes.length;
  const selectedAllMakes = selectedMakes.length === makes.length;

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

  const filteredMakes = applyFilters(makes, query);
  const paginatedMakes = applyPagination(filteredMakes, page, limit);
  
  return (
    
    <Card className={clsx(classes.root, className)} {...rest}>

      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} all={deletedMakes}/>
      <div p={2} display="flex" className={classes.containerSync}>
      {
        loading === true ? (
          
          <FontAwesomeIcon className={classes.sync} icon={faSync} spin />
          
        ) : (
          <FontAwesomeIcon className={classes.sync} icon={faSync} onClick={() => { getMakes() }}/>
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
          placeholder={t("Makes.Search")}
          value={query}
          variant="outlined"
        />
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllMakes}
              indeterminate={selectedSomeMakes}
              onChange={handleSelectAllMakes}
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
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllMakes}
                    indeterminate={selectedSomeMakes}
                    onChange={handleSelectAllMakes}
                    onClick={(e)=>{setDeletedMakes(true)}}
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>{t("Makes.Make")}</TableCell>
                <TableCell>{t("Makes.Description")}</TableCell>
                <TableCell>{t("Makes.CreatedAt")}</TableCell>
              </TableRow>
            </TableHead>
            )}
            <TableBody>
              {paginatedMakes.map(make => {
                const isMakeSelected = selectedMakes.includes(
                  make._id
                );

                return (
                  <TableRow
                    hover
                    key={make && make._id}
                    selected={isMakeSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isMakeSelected}
                        onChange={event =>
                          handleSelectOneMake(event, make._id)
                        }
                        value={isMakeSelected}
                        onClick={(e)=>{setDeletedMakes(false)}}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/makes/${make && make._id}`}
                            variant="h6"
                          >
                            {make && make._id}
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
                            to={`/app/management/makes/${make && make._id}`}
                            variant="h6"
                          >
                            {make && CapitalizeNames(make.name)}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>{make && make.description ? Capitalize(make.description) : '- - -'}</TableCell>
                    <TableCell>{make && moment(make.createdAt).format('ll')}</TableCell>

                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={filteredMakes.length}
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
  makes: PropTypes.array.isRequired
};

Results.defaultProps = {
  makes: []
};

export default Results;
