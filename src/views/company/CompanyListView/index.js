import React, { useEffect } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Results from './Results';
import useCompany from 'src/hooks/useCompany';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const CompanyListView = () => {
  const classes = useStyles();

  const { getCompanies, companies } = useCompany();

  useEffect(() => {
    getCompanies();
    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="Companies List">
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results companies={companies} />
        </Box>
      </Container>
    </Page>
  );
};

export default CompanyListView;
