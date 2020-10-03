import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Divider,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import useSource from 'src/hooks/useSource';
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

const SourceDetailsView = () => {
  const classes = useStyles();
  const { source, getSource } = useSource();

  const { id } = useParams();

  useEffect(() => {

    getSource(id);

    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="Source Details">
      <Container maxWidth={false}>
        <Header source={source} />
        <Divider />
        <Box mt={3}>
          <Details source={source} />
        </Box>
      </Container>
    </Page>
  );
};

export default SourceDetailsView;
