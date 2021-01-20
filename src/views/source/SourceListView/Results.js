import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SimpleDialog from 'src/components/SimpleDialog'
import useSource from 'src/hooks/useSource';
import wait from 'src/utils/wait';
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
import {
  Search as SearchIcon
} from 'react-feather';
import { useTranslation } from 'react-i18next';
import moment from 'moment'

const applyFilters = (sources, query, filters) => {
  return sources.filter(source => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach(property => {
        if (source[property].toLowerCase().includes(query.toLowerCase())) {
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

const applyPagination = (sources, page, limit) => {
  return sources.slice(page * limit, page * limit + limit);
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

const Results = ({ className, sources, ...rest }) => {

  const classes = useStyles();
  const [selectedSources, setSelectedSources] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [deletedSources, setDeletedSources] = useState(false)
  const { getSources, deleteSource, loading } = useSource();
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();
  const { t } = useTranslation()

  const handleClose = async (value) => {
    setOpen(false);
    setSelectedValue(value);
    if(value === 'yes'){
      await selectedSources.map(async source => await deleteSource(source));
      await wait(1000);
      await getSources();
      setSelectedSources([])
    }
  };

  const handleDelete =  async () =>{
    setOpen(true);    
  }

  const handleSelectAllSources = event => {
    setSelectedSources(
      event.target.checked ? sources.map(source => source._id) : []
    );
  };

  const handleSelectOneSource = (event, sourceId) => {
    if (!selectedSources.includes(sourceId)) {
      setSelectedSources(prevSelected => [...prevSelected, sourceId]);
    } else {
      setSelectedSources(prevSelected =>
        prevSelected.filter(id => id !== sourceId)
      );
    }
  };

   const enableBulkOperations = selectedSources.length > 0;
  const selectedSomeSources =
    selectedSources.length > 0 && selectedSources.length < sources.length;
  const selectedAllSources = selectedSources.length === sources.length;

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

  const filteredSources = applyFilters(sources, query);
  const paginatedSources = applyPagination(filteredSources, page, limit);
  
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} all={deletedSources}/>
      <div p={2} display="flex" className={classes.containerSync}>
      {
        loading === true ? (
          
          <FontAwesomeIcon className={classes.sync} icon={faSync} spin />
          
        ) : (
          <FontAwesomeIcon className={classes.sync} icon={faSync} onClick={() => { getSources() }}/>
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
          placeholder={t("Sources.Search")}
          value={query}
          variant="outlined"
        />
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllSources}
              indeterminate={selectedSomeSources}
              onChange={handleSelectAllSources}
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
                    checked={selectedAllSources}
                    indeterminate={selectedSomeSources}
                    onChange={handleSelectAllSources}
                    onClick={(e)=>{setDeletedSources(true)}}

                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>{t("Sources.Name")}</TableCell>
                <TableCell>{t("Sources.Description")}</TableCell>
                <TableCell>{t("Sources.CreatedAt")}</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSources.map(source => {
                const isSourceSelected = selectedSources.includes(
                  source._id
                );

                return (
                  <TableRow
                    hover
                    key={source._id}
                    selected={isSourceSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSourceSelected}
                        onChange={event =>
                          handleSelectOneSource(event, source._id)
                        }
                        value={isSourceSelected}
                        onClick={(e)=>{setDeletedSources(false)}}

                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/sources/${source._id}`}
                            variant="h6"
                          >
                            {source._id}
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
                            to={`/app/management/sources/${source._id}`}
                            variant="h6"
                          >
                            {CapitalizeNames(source.name)}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>{source && source.description ? Capitalize(source.description) : '- - -'}</TableCell>
                    <TableCell>{source && moment(source.createdAt).format('ll')}</TableCell>
                  
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={filteredSources.length}
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
  sources: PropTypes.array.isRequired
};

Results.defaultProps = {
  sources: []
};

export default Results;
