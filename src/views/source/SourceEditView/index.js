import React, {
  useEffect
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import SourceEditForm from './SourceEditForm';
import Header from './Header';
import useSource from 'src/hooks/useSource';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const SourceEditView = () => {
  const classes = useStyles();
  const { getSource, source } = useSource();

  const route = useParams();


  useEffect(() => {
    
    getSource(route.id);
    // eslint-disable-next-line
  }, []);

  return (
    <Page
      className={classes.root}
      title="Source Edit"
    >
      <Container maxWidth={false}>
        <Header />
      </Container>
      <Box mt={3}>
        <Container maxWidth="lg">
          <SourceEditForm source={source} />
        </Container>
      </Box>
    </Page>
  );
};

export default SourceEditView;
