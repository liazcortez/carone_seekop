import React, { useEffect } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Results from './Results';
import useSocialAccount from 'src/hooks/useSocialAccount';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const SocialAccountListView = () => {
  const classes = useStyles();

  const { getSocialAccounts, socialAccounts } = useSocialAccount();

  useEffect(() => {
    getSocialAccounts();
    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="SocialAccounts List">
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results socialAccounts={socialAccounts} />
        </Box>
      </Container>
    </Page>
  );
};

export default SocialAccountListView;
