import React, { useEffect } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Results from './Results';
import useUser from 'src/hooks/useUser';

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

  const { getUsers, users } = useUser();

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="User List">
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results users={users} />
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
