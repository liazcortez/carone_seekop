import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SimpleDialog from 'src/components/SimpleDialog'
import useCompany from 'src/hooks/useCompany';
import wait from 'src/utils/wait';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import { CapitalizeNames } from 'src/utils/capitalize'

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

const applyFilters = (companies, query) => {
  return companies.filter(company => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach(property => {
        if (company[property].toLowerCase().includes(query.toLowerCase())) {
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

const applyPagination = (companies, page, limit) => {
  return companies.slice(page * limit, page * limit + limit);
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

const Results = ({ className, companies, ...rest }) => {

  const classes = useStyles();
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const { t } = useTranslation();
  const { getCompanies, deleteCompany, loading } = useCompany();
  const [deletedCompanies, setDeletedCompanies] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();

  const handleClose = async (value) => {
    setOpen(false);
    setSelectedValue(value);
    if(value === 'yes'){
      selectedCompanies.map(company => deleteCompany(company));
      setSelectedCompanies([])
    }
  };

  const handleDelete =  async () =>{
    setOpen(true);    
  }

  const handleSelectAllCompanies = event => {
    setSelectedCompanies(
      event.target.checked ? companies.map(company => company._id) : []
    );
  };

  const handleSelectOneCompany = (event, companyId) => {
    if (!selectedCompanies.includes(companyId)) {
      setSelectedCompanies(prevSelected => [...prevSelected, companyId]);
    } else {
      setSelectedCompanies(prevSelected =>
        prevSelected.filter(id => id !== companyId)
      );
    }
  };

   const enableBulkOperations = selectedCompanies.length > 0;
  const selectedSomeCompanies =
    selectedCompanies.length > 0 && selectedCompanies.length < companies.length;
  const selectedAllCompanies = selectedCompanies.length === companies.length;

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

  const filteredCompanies = applyFilters(companies, query);
  const paginatedCompanies = applyPagination(filteredCompanies, page, limit);
  
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} all={deletedCompanies}/>
      <div p={2} display="flex" className={classes.containerSync}>
      {
        loading === true ? (
          
          <FontAwesomeIcon className={classes.sync} icon={faSync} spin />
          
        ) : (
          <FontAwesomeIcon className={classes.sync} icon={faSync} onClick={() => { getCompanies() }}/>
        )
      }

      </div>    
      <Tabs
        scrollButtons="auto"
        textColor="secondary"
        value={'all'}
        variant="scrollable"
      >
          <Tab key={'all'} value={'all'} label={t("Tabs.All")} />
        
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
          placeholder={t("Companies.Search")}
          value={query}
          variant="outlined"
        />
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllCompanies}
              indeterminate={selectedSomeCompanies}
              onChange={handleSelectAllCompanies}
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
                    checked={selectedAllCompanies}
                    indeterminate={selectedSomeCompanies}
                    onChange={handleSelectAllCompanies}
                    onClick={(e)=>{setDeletedCompanies(true)}}

                  />
                </TableCell>
                <TableCell>{t("Companies.Name")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCompanies.map(company => {
                const isCompanySelected = selectedCompanies.includes(
                  company._id
                );

                return (
                  <TableRow
                    hover
                    key={company._id}
                    selected={isCompanySelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isCompanySelected}
                        onChange={event =>
                          handleSelectOneCompany(event, company._id)
                        }
                        value={isCompanySelected}
                        onClick={(e)=>{setDeletedCompanies(false)}}

                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/companies/${company._id}`}
                            variant="h6"
                          >
                            {CapitalizeNames(company.name)}
                          </Link>
                        </div>
                      </Box>
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
        count={filteredCompanies.length}
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
  companies: PropTypes.array.isRequired
};

Results.defaultProps = {
  companies: []
};

export default Results;
