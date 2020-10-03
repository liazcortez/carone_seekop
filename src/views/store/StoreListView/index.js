import React, { useEffect } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Results from './Results';
import useStore from 'src/hooks/useStore';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const StoreListView = () => {
  const classes = useStyles();

  const { getStores, stores } = useStore();

  useEffect(() => {
    getStores();
    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="Store List">
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results stores={stores} />
        </Box>
      </Container>
    </Page>
  );
};

export default StoreListView;
