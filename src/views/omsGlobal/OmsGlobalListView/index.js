import React, { useEffect, useState } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Results from './Results';
import useOmsGlobal from 'src/hooks/useOmsGlobal';
import useAuth from 'src/hooks/useAuth';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));


const CustomerListView = () => {
  const classes = useStyles();
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(0);
  const [searching, setSearching] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  const [query, setQuery] = useState('');
  const { getOmsGlobals, AdvancedResults, omsGlobals, getOmsGlobalsByStore, getOmsGlobalsByUser, clearState } = useOmsGlobal();
  const { user  } = useAuth();
  const [isAdvancedSearch, setAdvancedSearch] = useState(false)
  const [state, setState] = useState({
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

  useEffect(()=>{
    if(user && user.store && (user.role === 'user' || user.role === 'admin')){
      setState({...state, make: `${user.store.make._id}/${user.store.make.name}`, store: `${user.store._id}/${user.store.name}`})
    }
    //eslint-disable-next-line
  },[user])

  useEffect(()=>{
    clearState();
    //eslint-disable-next-line
  },[])

  const setInformation = async () =>{
   
    if(user){
      if(!isAdvancedSearch){
        if(!searching){
          let typeQuery = '';
          if(query !== ''){
            typeQuery = 'or'
          }
          if(user.role === 'rockstar' || user.role === 'super admin'){
            getOmsGlobals({limit: limit, page: page + 1}, currentTab, query, typeQuery);
          }
          if(user.role === 'admin'){
            if(user.store){
              getOmsGlobalsByStore(user.store._id, {limit: limit, page: page + 1} , currentTab, query, typeQuery);
            }
          }
          if(user.role === 'user'){
            getOmsGlobalsByUser(user._id, {limit: limit, page: page + 1} , currentTab, query, typeQuery)
          }
        }
      }else{
        AdvancedResults({limit: limit, page: page + 1}, state)
      }

    }
  }

  useEffect(() => {
    setInformation();
    // eslint-disable-next-line
  }, [user, page, limit, currentTab, isAdvancedSearch]);


  return (
    <Page className={classes.root} title="OmsGlobal List">
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results 
            isAdvancedSearch={isAdvancedSearch}
            setAdvancedSearchIndex={setAdvancedSearch}
            state={state}
            setState={setState}
            omsGlobals={omsGlobals} 
            limit={limit} 
            setLimit={setLimit} 
            page={page} 
            setPage={setPage} 
            setCurrentTab={setCurrentTab} 
            currentTab={currentTab}
            setSearching={setSearching} 
            setInformation={setInformation}
            query={query}
            setQuery={setQuery}
          />
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
