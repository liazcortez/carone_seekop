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
import useOmsGlobal from 'src/hooks/useOmsGlobal';
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
  const { getOmsGlobal, omsGlobal } = useOmsGlobal();

  const route = useParams();


  useEffect(() => {
    
    getOmsGlobal(route.id);
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
          <LeadEditForm lead={omsGlobal} />
        </Container>
      </Box>
    </Page>
  );
};

export default LeadEditView;
