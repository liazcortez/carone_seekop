import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Divider,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import useUser from 'src/hooks/useUser';
import { useParams } from 'react-router';
import Details from './Details';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const CustomerDetailsView = () => {
  const classes = useStyles();
  const { user, getUser } = useUser();


  const { id } = useParams();
  useEffect(() => {
    getUser(id);

    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="Customer Details">
      <Container maxWidth={false}>
        <Header user={user} />
        <Divider />
        <Box mt={3}>
          <Details user={user} />
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerDetailsView;
