import React, { useEffect } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Results from './Results';
import useStatus from 'src/hooks/useStatus';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const StatusListView = () => {
  const classes = useStyles();

  const { getStatuses, statuses } = useStatus();

  useEffect(() => {
    getStatuses();
    getStatuses();
    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="Status List">
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results statuses={statuses} />
        </Box>
      </Container>
    </Page>
  );
};

export default StatusListView;
