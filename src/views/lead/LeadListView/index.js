import React, { useEffect } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Results from './Results';
import useLead from 'src/hooks/useLead';
import useAuth from 'src/hooks/useAuth';


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

  const { getLeads, leads, getLeadsByStore, getLeadsByUser } = useLead();
  const { user  } = useAuth();


  useEffect(() => {
      if(user){
        if(user.role === 'rockstar' || user.role === 'super admin'){
            getLeads();
        }
        if(user.role === 'admin'){
          if(user.store){
            getLeadsByStore(user.store._id, '');
          }
        }
        if(user.role === 'user'){
          getLeadsByUser(user._id, '')
        }
      }
   // eslint-disable-next-line
  }, [user])

  return (
    <Page className={classes.root} title="Lead List">
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results leads={leads} />
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
