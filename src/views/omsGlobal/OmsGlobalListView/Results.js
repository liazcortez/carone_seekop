import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useOmsGlobal from 'src/hooks/useOmsGlobal';
import wait from 'src/utils/wait';
import SimpleDialog from 'src/components/SimpleDialog'
import useAuth from 'src/hooks/useAuth';
import moment from 'moment';
import useStatus from 'src/hooks/useStatus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import Label from 'src/components/Label';
import { useTranslation } from 'react-i18next'
import {Capitalize, CapitalizeNames} from 'src/utils/capitalize';
import AdvancedSearch from './SearchModal';
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
  IconButton,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  Settings as AdvancedSearchIcon,
  X as CancelAdvancedSearchIcon,
} from 'react-feather';

const useStyles = makeStyles(theme => ({
  root: {},
  queryField: {
    width: 500
  },
  bulkOperations: {
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: '1em',
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
  },
  cancelButton: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary
  },
  labelSearch: {
    marginLeft: '1em',
    marginTop: '0.5em',
    display: 'inline-block',
  }
}));

const propertiesState = [
    'company', 
    'name', 
    'email', 
    'inventory', 
    'serie', 
    'key', 
    'year', 
    'modeType', 
    'modeDescription', 
    'descModel', 
    'yearModel', 
    'store', 
    'methodPayment', 
    'stateName',
    'municipyName',
    'faauColony',
    'seller',
    'color',
    'make',
    'status', 
    'phone',
    'before',
    'after'
  ];

const Results = ({ 
  state, 
  setState, 
  setAdvancedSearchIndex,
  isAdvancedSearch,
  className, 
  omsGlobals, 
  setLimit, 
  query, 
  setQuery, 
  setPage, 
  limit,
  page, 
  setSearching, 
  searching, 
  currentTab, 
  setCurrentTab, 
  setInformation, 
  ...rest }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [selectedOmsGlobals, setSelectedOmsGlobals] = useState([]);
  const { deleteOmsGlobal, count, loading } = useOmsGlobal();
  const [multipleDelete, setMultipleDelete] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();
  const { user } = useAuth();
  const { statuses, getStatuses } = useStatus();
  const [advancedSearch, setAdvancedSearch] = useState(false)

  const handleAdvancedSearch = () => setAdvancedSearch(true)

  useEffect(() => {
    if(multipleDelete){
      setMultipleDelete(false)
    }
    // eslint-disable-next-line
  }, [multipleDelete])

  useEffect(() => {
    getStatuses();
    // eslint-disable-next-line
  }, [])

  const clearState = () => setState({
    name: '',
    email: '',
    phone: '',
    make: '',
    status: '',
    company: '',
    inventory: '',
    serie: '',
    key: '',
    year: '',
    modeType: '',
    modeDescription: '',
    descModel: '',
    yearModel: '',
    store: '',
    methodPayment: '',
    stateName: '',
    municipyName: '',
    faauColony: '',
    seller: '',
    color: '',
    before: moment(0)._d,
    after: moment(0)._d
  })

  const handleOnBlur = () =>{
      setInformation();
  }


  const handleClose = async(value) => {
    setOpen(false);
    setSelectedValue(value);
    if(value === 'yes'){
      selectedOmsGlobals.map(id => deleteOmsGlobal(id));
      await wait(1000);
      setInformation();
      setSelectedOmsGlobals([])

    }
  };

  const handleDelete =  async () =>{
    setOpen(true);    
  }

  const handleSelectAllOmsGlobals = event => {
    setSelectedOmsGlobals(
      event.target.checked ? omsGlobals.map(omsGlobal => omsGlobal._id) : []
    );
  };

  const handleSelectOneOmsGlobal = (event, omsGlobalId) => {
    if (!selectedOmsGlobals.includes(omsGlobalId)) {
      setSelectedOmsGlobals(prevSelected => [...prevSelected, omsGlobalId]);
    } else {
      setSelectedOmsGlobals(prevSelected =>
        prevSelected.filter(id => id !== omsGlobalId)
      );
    }
  };

  const enableBulkOperations = selectedOmsGlobals.length > 0;
  const selectedSomeOmsGlobals =
    selectedOmsGlobals.length > 0 && selectedOmsGlobals.length < omsGlobals.length;
  const selectedAllOmsGlobals = selectedOmsGlobals.length === omsGlobals.length;


   const handleTabsChange = (event, value) => {
      setPage(0)
      setCurrentTab(value);
   };


  const handleReload = () => {
    setInformation()
  }

  const handleKeyUp = async (event) => {
    if (event.keyCode === 13 && query !== '') {
      setPage(0);
      setInformation();
    }
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

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <AdvancedSearch open={advancedSearch} setOpen={setAdvancedSearch} limit={limit} page={page} state={state} setState={setState} setAdvancedSearch={setAdvancedSearchIndex} setCurrentTab={setCurrentTab} user={user}/>
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
        <Tab key={'all'} value={'all'} label={t("Tabs.All")}  disabled={loading || isAdvancedSearch}/>

        {statuses && statuses.map(status => (
          status.name === 'new' ?
            <Tab key={status._id} value={`status.${status._id}`} label={t("OmsGlobals.New")} disabled={loading || isAdvancedSearch}/> : false
        ))}
        {statuses && statuses.map(status => (
          status.name === 'documentation' ?
            <Tab key={status._id} value={`status.${status._id}`} label={t("OmsGlobals.Documentation")} disabled={loading || isAdvancedSearch}/> : false
        ))}
        {statuses && statuses.map(status => (
          status.name === 'sold' ?
            <Tab key={status._id} value={`status.${status._id}`} label={t("OmsGlobals.Sold")} disabled={loading || isAdvancedSearch}/> : false
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
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color='primary'
                  aria-label="advanced search"
                  onClick={handleAdvancedSearch}
                  edge="end"
                >
                  <AdvancedSearchIcon /> 
                </IconButton>
              </InputAdornment>
            )
          }}
          onKeyUp={handleKeyUp}
          onChange={handleQueryChange}
          placeholder={t("OmsGlobals.Search")}
          value={query}
          variant="outlined"
          disabled={loading}
          onBlur={handleOnBlur}
        />

      {
        isAdvancedSearch ? (
          <Button
            color="primary"
            type="button"
            variant="contained"
            onClick={(e)=>{
              setAdvancedSearchIndex(false)
              clearState()
            }}
            style={{marginLeft: '2em', textTransform: 'capitalize', height: 56}}
            startIcon={
              <CancelAdvancedSearchIcon/>
            }
            >
              {t("AdvancedAll.Close")}
          </Button>
        ) : null
      }

       
      </Box>
      {
            isAdvancedSearch ? (
              <Box p={2}  alignItems="center" >
              {
                propertiesState.map(key => {
                  if(key !== 'before' && key !== 'after' && key !== 'make' && key !== 'company' && key !== 'status' && key !== 'store'){
                    if(state[key] !== '' ){
                      return (
                        <div className={classes.labelSearch} key={key}>
                            <Label
                              key={key}
                              className={classes.capitalize}
                              color={'grey'}
                            >   
                              { t(`Keys.${key}`) + ': ' + state[key] }
                            </Label>
                          </div>
                      )
                    }
                  }else if(key === 'make' || key === 'status' || key === 'company' || key === 'store'){
                    if(state[key].split("/")[0] !== '0' && state[key] !== '' ){
                      return (
                        <div className={classes.labelSearch} key={key}>
                            <Label
                              key={key}
                              className={classes.capitalize}
                              color={'grey'}
                            >   
                              { t(`Keys.${key}`) + ': ' + state[key].split("/")[1] }
                            </Label>
                          </div>
                      )
                    }
                  }else{
                    if(!moment(state[key]).isSame(moment(0))){
                      return (
                        <div className={classes.labelSearch} key={key}>
                            <Label
                              key={key}
                              className={classes.capitalize}
                              color={'grey'}
                            >   
                              { 
                                `${t(`Keys.${key}`)}: ${moment(state[key]).format('lll')}`
                              }
                            </Label>
                          </div>
                      )
                    }
                  }
                    
                  return false;
                })
              }
              </Box>

            ) : null
          }
     
      { enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllOmsGlobals}
              indeterminate={selectedSomeOmsGlobals}
              onChange={handleSelectAllOmsGlobals}
            />
            <Button variant="outlined" className={classes.bulkAction} onClick={handleDelete}>
              {t("Buttons.Delete")}
            </Button>
            
          </div>
        </div>
      )}
      <PerfectScrollbar >
        <Box minWidth={700}>
          <Table>
            {
              !enableBulkOperations && (
                <TableHead>
                <TableRow>
                  {user && user.role && (user.role === 'rockstar'|| user.role === 'super admin') ? (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAllOmsGlobals}
                      indeterminate={selectedSomeOmsGlobals}
                      onChange={handleSelectAllOmsGlobals}
                    />
                  </TableCell>
                  ): false}
                  <TableCell>{t("OmsGlobals.Name")}</TableCell>
                  <TableCell>{t("OmsGlobals.Email")}</TableCell>
                  <TableCell>{t("OmsGlobals.Make")}</TableCell>
                  <TableCell>{t("OmsGlobals.Store")}</TableCell>
                  <TableCell>{t("OmsGlobals.Phone")}</TableCell>
                  <TableCell>{t("OmsGlobals.Phone")}</TableCell>
                  <TableCell>{t("OmsGlobals.Date")}</TableCell>
                  <TableCell>{t("OmsGlobals.Status")}</TableCell>
                </TableRow>
              </TableHead>
              )
            }
          
            <TableBody>
              {omsGlobals.map(omsGlobal => {
                const isOmsGlobalSelected = selectedOmsGlobals.includes(
                  omsGlobal._id
                );

                return (
                  <TableRow
                    hover
                    key={omsGlobal._id}
                    style={{color: 'green'}}
                    selected={isOmsGlobalSelected}
                  >
                    {user && user.role && (user.role === 'rockstar'|| user.role === 'super admin') ? (<TableCell padding="checkbox">
                      <Checkbox
                        checked={isOmsGlobalSelected}
                        onChange={event =>
                          handleSelectOneOmsGlobal(event, omsGlobal._id)
                        }
                        value={isOmsGlobalSelected}
                      />
                    </TableCell>) : false}
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/omsLeads/${omsGlobal._id}`}
                            variant="h6"
                          >
                            {omsGlobal && omsGlobal.name ? CapitalizeNames(omsGlobal.name) + ' ': ''}
                            {
                              omsGlobal && omsGlobal.name !== 'na' ? CapitalizeNames(omsGlobal.apPaterno) + ' ' : ''
                            }
                            {
                              omsGlobal && omsGlobal.name !== 'na' ? CapitalizeNames(omsGlobal.apMaterno) : ''
                            }
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>{omsGlobal && omsGlobal.email ? Capitalize(omsGlobal.email) : ''}</TableCell>
                    <TableCell>
                      {omsGlobal && omsGlobal.make && omsGlobal.make.name ? CapitalizeNames(omsGlobal.make.name) : 'Na'}
                    </TableCell>
                    <TableCell>
                      {omsGlobal && omsGlobal.store && omsGlobal.store.name ? CapitalizeNames(omsGlobal.store.name) : 'Na'}
                    </TableCell>
                    <TableCell>{omsGlobal && omsGlobal.phone ? omsGlobal.phone : 'Na'}</TableCell>
                    <TableCell>{omsGlobal && omsGlobal.phone2 && omsGlobal.phone2 !== 'na' ? omsGlobal.phone2 : 'Na'}</TableCell>
                    <TableCell>   
                       
                        {omsGlobal && omsGlobal.createdAt ? moment(omsGlobal.faauDate).format('ll') : 'Na'}                
                    </TableCell>
                    <TableCell>
                        
                          <Label
                            className={classes.capitalize}
                            color={omsGlobal && omsGlobal.status && 
                              omsGlobal.status.name === 'sold' ? 'error' :
                              omsGlobal.status.name === 'documentation' ? 'warning' : 
                              omsGlobal.status.name === 'new' ? 'success' : 'primary'}
                          >   
                          {omsGlobal && omsGlobal.status && omsGlobal.status.name ? CapitalizeNames(omsGlobal.status.name) : ''}
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
        count={count ? count : 0}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  omsGlobals: PropTypes.array.isRequired
};

Results.defaultProps = {
  omsGlobals: []
};

export default Results;

