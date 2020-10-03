import React, {
  useEffect
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import MakeEditForm from './MakeEditForm';
import Header from './Header';
import useMake from 'src/hooks/useMake';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const MakeEditView = () => {
  const classes = useStyles();
  const { getMake, make } = useMake();

  const route = useParams();


  useEffect(() => {
    
    getMake(route.id);
    // eslint-disable-next-line
  }, []);

  return (
    <Page
      className={classes.root}
      title="Make Edit"
    >
      <Container maxWidth={false}>
        <Header />
      </Container>
      <Box mt={3}>
        <Container maxWidth="lg">
          <MakeEditForm make={make} />
        </Container>
      </Box>
    </Page>
  );
};

export default MakeEditView;
