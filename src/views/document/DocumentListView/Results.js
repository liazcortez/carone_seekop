import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SimpleDialog from 'src/components/SimpleDialog'
import useDocument from 'src/hooks/useDocument';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CapitalizeNames} from 'src/utils/capitalize';
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
import { useTranslation } from 'react-i18next';

const applyFilters = (documents, query) => {
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

    return matches;
  });
};

const applyPagination = (documents, page, limit) => {
  return documents.slice(page * limit, page * limit + limit);
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
  },
  download: {
    color: theme.palette.text.primary
  }
}));

const Results = ({ className, documents, ...rest }) => {

  const classes = useStyles();
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const { getDocuments, deleteDocument, loading } = useDocument();
  const [deletedDocuments, setDeletedDocuments] = useState(false)
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation()
  const [selectedValue, setSelectedValue] = React.useState();
 
  const handleClose = async (value) => {
    setOpen(false);
    setSelectedValue(value);
    if(value === 'yes'){
      selectedDocuments.map(document => deleteDocument(document));
      setSelectedDocuments([])
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

  const filteredDocuments = applyFilters(documents, query);
  const paginatedDocuments = applyPagination(filteredDocuments, page, limit);
  
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} all={deletedDocuments}/>
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
          placeholder={t("Documents.Search")}
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
                    checked={selectedAllDocuments}
                    indeterminate={selectedSomeDocuments}
                    onChange={handleSelectAllDocuments}
                    onClick={(e)=>{setDeletedDocuments(true)}}

                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>{t("Documents.Title")}</TableCell>
                <TableCell>{t("Documents.File")}</TableCell>
                <TableCell>{t("Documents.Store")}</TableCell>
                <TableCell>{t("Documents.CreatedAt")}</TableCell>
              </TableRow>
            </TableHead>
            )}
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
                        onClick={(e)=>{setDeletedDocuments(false)}}

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
                            {document._id}
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
                            to={`/app/management/documents/${document._id}`}
                            variant="h6"
                          >
                            {CapitalizeNames(document.title)}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>
                    <a
                      className={classes.download}
                      href={`${process.env.REACT_APP_URL_IMAGE_S3_URL}${document.file}`}
                      download
                    >
                        <DownloadIcon/>
                    </a>
                    </TableCell>
                    <TableCell>{document && document.store && document.store.make && CapitalizeNames(document.store.make.name) + ' ' + CapitalizeNames(document.store.name)}</TableCell>
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
