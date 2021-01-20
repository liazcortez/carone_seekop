import React from 'react';
import {
  Box,
  Container,
  makeStyles,
  Divider

} from '@material-ui/core';
import Page from 'src/components/Page';
import LeadCreateForm from './LeadCreateForm';
import Header from './Header';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const LeadCreateView = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Create Lead"
    >
      <Container maxWidth="lg">
        <Header />
        <Divider />
        <Box mt={3}>
          <LeadCreateForm />
        </Box>
      </Container>
    </Page>
  );
};

export default LeadCreateView;
