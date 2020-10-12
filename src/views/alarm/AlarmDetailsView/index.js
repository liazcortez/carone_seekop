import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Divider,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Details from './Details';
import useStore from 'src/hooks/useStore';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));
let ArrayBol = [];

const StoreDetailsView = () => {
  const classes = useStyles();
  const { getStores, stores } = useStore();


  useEffect(()=>{
    getStores();
    //eslint-disable-next-line
  },[])

  useEffect(()=>{
    if(stores){
      stores.map( store =>{
        ArrayBol.push(store.alarm)
      })
      
    }

  },[stores])


  return (
    <Page className={classes.root} title="Store Details">
      <Container maxWidth={false}>
        <Header />
        <Divider />
        <Box mt={3}>
          <Details stores={stores} ArrayBol={ArrayBol}/>
        </Box>
      </Container>
    </Page>
  );
};

export default StoreDetailsView;
