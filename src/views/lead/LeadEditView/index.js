import React, {
  useEffect
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import LeadEditForm from './LeadEditForm';
import Header from './Header';
import useLead from 'src/hooks/useLead';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const LeadEditView = () => {
  const classes = useStyles();
  const { getLead, lead } = useLead();

  const route = useParams();


  useEffect(() => {
    
    getLead(route.id);
    // eslint-disable-next-line
  }, []);

  return (
    <Page
      className={classes.root}
      title="Lead Edit"
    >
      <Container maxWidth={false}>
        <Header />
      </Container>
      <Box mt={3}>
        <Container maxWidth="lg">
          <LeadEditForm lead={lead} />
        </Container>
      </Box>
    </Page>
  );
};

export default LeadEditView;
