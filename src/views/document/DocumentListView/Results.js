/*eslint no-unused-vars: 0*/


import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SimpleDialog from 'src/components/SimpleDialog'
import useDocument from 'src/hooks/useDocument';
import wait from 'src/utils/wait';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
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
  Search as SearchIcon,
  Download as DownloadIcon
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

const applyFilters = (documents, query, filters) => {
  return documents.filter(document => {
    let matches = true;

    if (query) {
      const properties = ['store', 'title', 'createdAt'];
      let containsQuery = false;

      properties.forEach(property => {
        if(property === 'title'){
          if (document[property].toLowerCase().includes(query.toLowerCase())) {
            containsQuery = true;
          }
        }
        if(property === 'store'){
          if (document[property].make.name.toLowerCase().includes(query.toLowerCase())) {
            containsQuery = true;
          }
          if (document[property].name.toLowerCase().includes(query.toLowerCase())) {
            containsQuery = true;
          }
        }
        if(property === 'createdAt'){
          const date = moment(document[property]).format('LL');
          if (date.toString().toLowerCase().includes(query.toString().toLowerCase())) {
            containsQuery = true;
          }
        }
        
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach(key => {
      const value = filters[key];

      if (value && document[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (documents, page, limit) => {
  return documents.slice(page * limit, page * limit + limit);
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

const applySort = (documents, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = documents.map((el, index) => [el, index]);

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
  },
  download: {
    color: theme.palette.text.primary
  }
}));

const Results = ({ className, documents, ...rest }) => {

  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const { getDocuments, deleteDocument, loading } = useDocument();
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
      await selectedDocuments.map(async document => await deleteDocument(document));
      await wait(1000);
      await getDocuments();
    }
  };

  const handleDelete =  async () =>{
    setOpen(true);    
  }

  const handleSelectAllDocuments = event => {
    setSelectedDocuments(
      event.target.checked ? documents.map(document => document._id) : []
    );
  };

  const handleSelectOneDocument = (event, documentId) => {
    if (!selectedDocuments.includes(documentId)) {
      setSelectedDocuments(prevSelected => [...prevSelected, documentId]);
    } else {
      setSelectedDocuments(prevSelected =>
        prevSelected.filter(id => id !== documentId)
      );
    }
  };

   const enableBulkOperations = selectedDocuments.length > 0;
  const selectedSomeDocuments =
    selectedDocuments.length > 0 && selectedDocuments.length < documents.length;
  const selectedAllDocuments = selectedDocuments.length === documents.length;

  const handleTabsChange = (event, value) => {
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
    setSelectedDocuments([]);
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

  const filteredDocuments = applyFilters(documents, query, filters);
  const sortedDocuments = applySort(filteredDocuments, sort);
  const paginatedDocuments = applyPagination(sortedDocuments, page, limit);
  
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
      <div p={2} display="flex" className={classes.containerSync}>
      {
        loading === true ? (
          
          <FontAwesomeIcon className={classes.sync} icon={faSync} spin />
          
        ) : (
          <FontAwesomeIcon className={classes.sync} icon={faSync} onClick={() => { getDocuments() }}/>
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
          placeholder="Search documents"
          value={query}
          variant="outlined"
        />
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllDocuments}
              indeterminate={selectedSomeDocuments}
              onChange={handleSelectAllDocuments}
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
                    checked={selectedAllDocuments}
                    indeterminate={selectedSomeDocuments}
                    onChange={handleSelectAllDocuments}
                  />
                </TableCell>
                <TableCell>Title</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Store</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDocuments.map(document => {
                const isDocumentSelected = selectedDocuments.includes(
                  document._id
                );

                return (
                  <TableRow
                    hover
                    key={document._id}
                    selected={isDocumentSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isDocumentSelected}
                        onChange={event =>
                          handleSelectOneDocument(event, document._id)
                        }
                        value={isDocumentSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/documents/${document._id}`}
                            variant="h6"
                          >
                            {document.title}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>
                    <a
                      className={classes.download}
                      href={`https://automotive-api.s3.us-east-2.amazonaws.com/${document.file}`}
                      download
                    >
                        <DownloadIcon 
                        />
                    </a>
                    </TableCell>
                    <TableCell>{document && document.store && document.store.make && document.store.make.name + ' ' + document.store.name}</TableCell>
                    <TableCell>{document && moment(document.createdAt).format('ll')}</TableCell>
                  
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={filteredDocuments.length}
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
  documents: PropTypes.array.isRequired
};

Results.defaultProps = {
  documents: []
};

export default Results;
