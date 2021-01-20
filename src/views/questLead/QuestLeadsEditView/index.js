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
import useQuestLead from 'src/hooks/useQuestLead';
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
  const { getQuestLead, questLead } = useQuestLead();

  const route = useParams();


  useEffect(() => {
    
    getQuestLead(route.id);
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
          <LeadEditForm lead={questLead} />
        </Container>
      </Box>
    </Page>
  );
};

export default LeadEditView;
