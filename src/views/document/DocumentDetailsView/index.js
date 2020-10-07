import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Divider,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import useDocument from 'src/hooks/useDocument';
import Details from './Details';
import { useParams } from 'react-router';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const DocumentDetailsView = () => {
  const classes = useStyles();
  const { document, getDocument } = useDocument();

  const { id } = useParams();

  useEffect(() => {

    getDocument(id);

    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="Document Details">
      <Container maxWidth={false}>
        <Header document={document} />
        <Divider />
        <Box mt={3}>
          <Details document={document} />
        </Box>
      </Container>
    </Page>
  );
};

export default DocumentDetailsView;
