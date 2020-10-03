import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Divider,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import useStatus from 'src/hooks/useStatus';
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

const StatusDetailsView = () => {
  const classes = useStyles();
  const { status, getStatus } = useStatus();

  const { id } = useParams();

  useEffect(() => {

    getStatus(id);

    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="Status Details">
      <Container maxWidth={false}>
        <Header status={status} />
        <Divider />
        <Box mt={3}>
          <Details status={status} />
        </Box>
      </Container>
    </Page>
  );
};

export default StatusDetailsView;
