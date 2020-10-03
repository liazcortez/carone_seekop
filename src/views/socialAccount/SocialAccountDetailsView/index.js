import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Divider,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import useSocialAccount from 'src/hooks/useSocialAccount';
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

const SocialAccountDetailsView = () => {
  const classes = useStyles();
  const { socialAccount, getSocialAccount } = useSocialAccount();

  const { id } = useParams();

  useEffect(() => {

    getSocialAccount(id);

    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="SocialAccount Details">
      <Container maxWidth={false}>
        <Header socialAccount={socialAccount} />
        <Divider />
        <Box mt={3}>
          <Details socialAccount={socialAccount} />
        </Box>
      </Container>
    </Page>
  );
};

export default SocialAccountDetailsView;
