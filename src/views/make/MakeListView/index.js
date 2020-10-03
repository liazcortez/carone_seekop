import React, { useEffect } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Results from './Results';
import useMake from 'src/hooks/useMake';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const MakeListView = () => {
  const classes = useStyles();

  const { getMakes, makes } = useMake();

  useEffect(() => {
    getMakes();
    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="Make List">
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results makes={makes} />
        </Box>
      </Container>
    </Page>
  );
};

export default MakeListView;
