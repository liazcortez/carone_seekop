import React, {
  useEffect
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import StatusEditForm from './StatusEditForm';
import Header from './Header';
import useStatus from 'src/hooks/useStatus';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const StatusEditView = () => {
  const classes = useStyles();
  const { getStatus, status } = useStatus();

  const route = useParams();


  useEffect(() => {
    
    getStatus(route.id);
    // eslint-disable-next-line
  }, []);

  return (
    <Page
      className={classes.root}
      title="Status Edit"
    >
      <Container maxWidth={false}>
        <Header />
      </Container>
      <Box mt={3}>
        <Container maxWidth="lg">
          <StatusEditForm status={status} />
        </Container>
      </Box>
    </Page>
  );
};

export default StatusEditView;
