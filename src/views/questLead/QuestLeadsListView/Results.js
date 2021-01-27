import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Label from 'src/components/Label';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useQuestLead from 'src/hooks/useQuestLead';
import wait from 'src/utils/wait';
import SimpleDialog from 'src/components/SimpleDialog'
import useStatus from 'src/hooks/useStatus';
import useAuth from 'src/hooks/useAuth';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
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
const propertiesState = ['name', 'email', 'store', 'source', 'status', 'make', 'model', 'phone', 'seller', 'sellerKey', 'sellerEmail', 'idQuest', 'before', 'after'];

const Results = ({ 
  state, 
  setState, 
  setAdvancedSearchIndex,
  isAdvancedSearch,
  className, 
  questLeads, 
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
  const [selectedQuestLeads, setSelectedQuestLeads] = useState([]);
  const { deleteQuestLead, count, loading } = useQuestLead();
  const [multipleDelete, setMultipleDelete] = useState(false);
  const [open, setOpen] = React.useState(false);
  const { statuses, getStatuses } = useStatus();
  const [selectedValue, setSelectedValue] = React.useState();
  const [advancedSearch, setAdvancedSearch] = useState(false)
  const { user } = useAuth();
 
  const handleAdvancedSearch = () => setAdvancedSearch(true)

  useEffect(() => {
    if(multipleDelete){
      setMultipleDelete(false)
    }
    // eslint-disable-next-line
  }, [multipleDelete])

  const handleOnBlur = () =>{
      setInformation();
  }

  useEffect(() => {
    getStatuses();
    // eslint-disable-next-line
  }, [])


  const clearState = () => setState({
    name: '',
    email: '',
    phone: '',
    store: '',
    make: '',
    model: '',
    source: '',
    status: '',
    seller: '',
    sellerKey: '',
    sellerEmail: '',
    idQuest: '',
    before: moment(0)._d,
    after: moment(0)._d
  })

  const handleClose = async(value) => {
    setOpen(false);
    setSelectedValue(value);
    if(value === 'yes'){
      selectedQuestLeads.map(id => deleteQuestLead(id));
      await wait(1000);
      setInformation();
      setSelectedQuestLeads([])
    }
  };

  const handleDelete =  async () =>{
    setOpen(true);    
  }

  const handleSelectAllQuestLeads = event => {
    setSelectedQuestLeads(
      event.target.checked ? questLeads.map(questLead => questLead._id) : []
    );
  };

  const handleSelectOneQuestLead = (event, questLeadId) => {
    if (!selectedQuestLeads.includes(questLeadId)) {
      setSelectedQuestLeads(prevSelected => [...prevSelected, questLeadId]);
    } else {
      setSelectedQuestLeads(prevSelected =>
        prevSelected.filter(id => id !== questLeadId)
      );
    }
  };

  const enableBulkOperations = selectedQuestLeads.length > 0;
  const selectedSomeQuestLeads =
    selectedQuestLeads.length > 0 && selectedQuestLeads.length < questLeads.length;
  const selectedAllQuestLeads = selectedQuestLeads.length === questLeads.length;


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
        <Tab key={'all'} value={'all'} label={t("Tabs.All")}  disabled={loading}/>

        {statuses && statuses.map(status => (
          status.name === 'new' ?
            <Tab key={status._id} value={`status.${status._id}`} label={t("OmsGlobals.New")} disabled={loading}/> : false
        ))}
        {statuses && statuses.map(status => (
          status.name === 'documentation' ?
            <Tab key={status._id} value={`status.${status._id}`} label={t("OmsGlobals.Documentation")} disabled={loading}/> : false
        ))}
        {statuses && statuses.map(status => (
          status.name === 'sold' ?
            <Tab key={status._id} value={`status.${status._id}`} label={t("OmsGlobals.Sold")} disabled={loading}/> : false
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
          placeholder={t("QuestLeads.Search")}
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
                  if(key !== 'before' && key !== 'after' && key !== 'make' && key !== 'vehicle' && key !== 'status' && key !== 'store' && key !== 'source'){
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
                  }else if(key === 'make' || key === 'status' || key === 'vehicle' || key === 'store' || key === 'source'){
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
              checked={selectedAllQuestLeads}
              indeterminate={selectedSomeQuestLeads}
              onChange={handleSelectAllQuestLeads}
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
                        checked={selectedAllQuestLeads}
                        indeterminate={selectedSomeQuestLeads}
                        onChange={handleSelectAllQuestLeads}
                      />
                    </TableCell>
                    ): false}
                    <TableCell>{t("QuestLeads.Name")}</TableCell>
                    <TableCell>{t("QuestLeads.Email")}</TableCell>
                    <TableCell>{t("QuestLeads.Phone")}</TableCell>
                    <TableCell>{t("QuestLeads.Store")}</TableCell>
                    <TableCell>{t("QuestLeads.Make")}</TableCell>
                    <TableCell>{t("QuestLeads.Model")}</TableCell>
                    <TableCell>{t("QuestLeads.Source")}</TableCell>
                    <TableCell>{t("QuestLeads.SellerKey")}</TableCell>
                    <TableCell>{t("QuestLeads.Seller")}</TableCell>
                    <TableCell>{t("QuestLeads.SellerEmail")}</TableCell>
                    <TableCell>{t("QuestLeads.TabletKey")}</TableCell>
                    <TableCell>{t("QuestLeads.OnAccount")}</TableCell>
                    <TableCell>{t("QuestLeads.CreatedAt")}</TableCell>
                    <TableCell>{t("QuestLeads.Status")}</TableCell>
                  </TableRow>
                </TableHead>
              )
            }
            <TableBody>
              {questLeads.map(questLead => {
                const isQuestLeadSelected = selectedQuestLeads.includes(
                  questLead._id
                );

                return (
                  <TableRow
                    hover
                    key={questLead._id}
                    style={{color: 'green'}}
                    selected={isQuestLeadSelected}
                  >
                    {user && user.role && (user.role === 'rockstar'|| user.role === 'super admin') ? (<TableCell padding="checkbox">
                      <Checkbox
                        checked={isQuestLeadSelected}
                        onChange={event =>
                          handleSelectOneQuestLead(event, questLead._id)
                        }
                        value={isQuestLeadSelected}
                      />
                    </TableCell>) : false}
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/app/management/questLeads/${questLead._id}`}
                            variant="h6"
                          >
                            {questLead && questLead.name ? CapitalizeNames(questLead.name): ''}
                          
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>{questLead && questLead.email ? questLead.email : 'None'}</TableCell>
                    <TableCell>{questLead && questLead.phone ? questLead.phone : 'None'}</TableCell>
                    <TableCell>
                      {questLead && questLead.store && questLead.store.name  && questLead.store.make ? 
                      Capitalize(questLead.make.name) + ' ' + CapitalizeNames(questLead.store.name) : 'None'}
                    </TableCell>
                    <TableCell style={{color: questLead.make === null ? '#d32f2f' : false}}>
                      {questLead && questLead.make && questLead.make.name ? CapitalizeNames(questLead.make.name) : 'None'}
                    </TableCell>
                    <TableCell style={{color: questLead.model === null ? '#d32f2f' : false}}>
                      {questLead && questLead.model && questLead.model.model ? CapitalizeNames(questLead.model.model) : 'None'}
                    </TableCell>
                    <TableCell style={{color: questLead.source === null ? '#d32f2f' : false}}>
                        {questLead && questLead.source && questLead.source && questLead.source.name ? CapitalizeNames(questLead.source.name) : 'None'}                
                    </TableCell>
                    <TableCell>
                      {questLead && questLead.sellerKey ? questLead.sellerKey : 'None'}
                    </TableCell>
                    <TableCell>
                      {questLead && questLead.seller ? questLead.seller : 'None'}
                    </TableCell>
                    <TableCell>
                      {questLead && questLead.sellerEmail ? questLead.sellerEmail : 'None'}
                    </TableCell>
                    <TableCell>
                      {questLead && questLead.idQuest ? questLead.idQuest : 'None'}
                    </TableCell>
                    <TableCell>
                      {questLead && questLead.onAccount ? questLead.onAccount : 'None'}
                    </TableCell>
                    <TableCell>   
                      {questLead && questLead.createdAt ? moment(questLead.createdAt).format('ll') : 'None'}                
                    </TableCell>
                    <TableCell>
                        <Label
                          className={classes.capitalize}
                          color={questLead && questLead.status && 
                            questLead.status.name === 'sold' ? 'error' :
                            questLead.status.name === 'documentation' ? 'warning' : 
                            questLead.status.name === 'new' ? 'success' : 'primary'}
                            >   
                        {questLead && questLead.status && questLead.status.name ? CapitalizeNames(questLead.status.name) : ''}
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
  questLeads: PropTypes.array.isRequired
};

Results.defaultProps = {
  questLeads: []
};

export default Results;

