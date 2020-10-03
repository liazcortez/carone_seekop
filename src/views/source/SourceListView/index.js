import React, { useEffect } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Results from './Results';
import useSource from 'src/hooks/useSource';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const SourceListView = () => {
  const classes = useStyles();

  const { getSources, sources } = useSource();

  useEffect(() => {
    getSources();
    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="Sources List">
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results sources={sources} />
        </Box>
      </Container>
    </Page>
  );
};

export default SourceListView;
