import React from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Chat from './Chat';

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

  return (
    <Page className={classes.root} title="Store List">
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Chat/>
        </Box>
      </Container>
    </Page>
  );
};

export default StoreListView;
