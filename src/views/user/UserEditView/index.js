import React, {
  useEffect
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import UserEditForm from './UserEditForm';
import UserEditPasswordForm from './UserEditPasswordForm';
import Header from './Header';
import useUser from 'src/hooks/useUser';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const UserEditView = () => {
  const classes = useStyles();
  const { getUser, user } = useUser();

  const route = useParams();


  useEffect(() => {
    
    getUser(route.id);
    // eslint-disable-next-line
  }, []);

  return (
    <Page
      className={classes.root}
      title="User Edit"
    >
      <Container maxWidth={false}>
        <Header />
      </Container>
      <Box mt={3}>
        <Container maxWidth="lg">
          <UserEditForm user={user} style={{paddingBottom: '1em'}}/>
          <UserEditPasswordForm user={user} />
        </Container>
      </Box>
    </Page>
  );
};

export default UserEditView;
