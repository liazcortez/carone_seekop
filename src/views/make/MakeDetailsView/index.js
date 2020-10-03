import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Divider,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import useMake from 'src/hooks/useMake';
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

const MakeDetailsView = () => {
  const classes = useStyles();
  const { make, getMake } = useMake();

  const { id } = useParams();

  useEffect(() => {

    getMake(id);

    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="Make Details">
      <Container maxWidth={false}>
        <Header make={make} />
        <Divider />
        <Box mt={3}>
          <Details make={make} />
        </Box>
      </Container>
    </Page>
  );
};

export default MakeDetailsView;
