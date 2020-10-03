import React, {
  useEffect
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import CompanyEditForm from './CompanyEditForm';
import Header from './Header';
import useCompany from 'src/hooks/useCompany';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const CompanyEditView = () => {
  const classes = useStyles();
  const { getCompany, company } = useCompany();

  const route = useParams();


  useEffect(() => {
    
    getCompany(route.id);
    // eslint-disable-next-line
  }, []);

  return (
    <Page
      className={classes.root}
      title="Company Edit"
    >
      <Container maxWidth={false}>
        <Header />
      </Container>
      <Box mt={3}>
        <Container maxWidth="lg">
          <CompanyEditForm company={company} />
        </Container>
      </Box>
    </Page>
  );
};

export default CompanyEditView;
