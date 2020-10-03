import React, {
  useEffect
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import SocialAccountEditForm from './SocialAccountEditForm';
import Header from './Header';
import useSocialAccount from 'src/hooks/useSocialAccount';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const SocialAccountEditView = () => {
  const classes = useStyles();
  const { getSocialAccount, socialAccount } = useSocialAccount();

  const route = useParams();


  useEffect(() => {
    
    getSocialAccount(route.id);
    // eslint-disable-next-line
  }, []);

  return (
    <Page
      className={classes.root}
      title="SocialAccount Edit"
    >
      <Container maxWidth={false}>
        <Header />
      </Container>
      <Box mt={3}>
        <Container maxWidth="lg">
          <SocialAccountEditForm socialAccount={socialAccount} />
        </Container>
      </Box>
    </Page>
  );
};

export default SocialAccountEditView;
