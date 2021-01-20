import React from 'react';
import {
  Box,
  Container,
  Divider,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Details from './Details';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const CsvDetails = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Load Leads">
      <Container maxWidth={false}>
        <Header />
        <Divider />
        <Box mt={3} >
          <Details />
        </Box>
      </Container>
    </Page>
  );
};

export default CsvDetails;
