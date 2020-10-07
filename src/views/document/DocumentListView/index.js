import React, { useEffect } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Results from './Results';
import useDocument from 'src/hooks/useDocument';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const DocumentListView = () => {
  const classes = useStyles();

  const { getDocuments, documents } = useDocument();

  useEffect(() => {
    getDocuments();
    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="Documents List">
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results documents={documents} />
        </Box>
      </Container>
    </Page>
  );
};

export default DocumentListView;
