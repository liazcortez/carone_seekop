import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Divider,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import useStore from 'src/hooks/useStore';
import Details from './Details';
import { useParams } from 'react-router';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const StoreDetailsView = () => {
  const classes = useStyles();
  const { store, getStore } = useStore();

  const { id } = useParams();

  useEffect(() => {

    getStore(id);

    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="Store Details">
      <Container maxWidth={false}>
        <Header store={store} />
        <Divider />
        <Box mt={3}>
          <Details store={store} />
        </Box>
      </Container>
    </Page>
  );
};

export default StoreDetailsView;
