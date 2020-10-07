import React, {
  useEffect
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import DocumentEditForm from './DocumentEditForm';
import Header from './Header';
import useDocument from 'src/hooks/useDocument';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const DocumentEditView = () => {
  const classes = useStyles();
  const { getDocument, document } = useDocument();

  const route = useParams();


  useEffect(() => {
    
    getDocument(route.id);
    // eslint-disable-next-line
  }, []);

  return (
    <Page
      className={classes.root}
      title="Document Edit"
    >
      <Container maxWidth={false}>
        <Header />
      </Container>
      <Box mt={3}>
        <Container maxWidth="lg">
          <DocumentEditForm document={document} />
        </Container>
      </Box>
    </Page>
  );
};

export default DocumentEditView;
