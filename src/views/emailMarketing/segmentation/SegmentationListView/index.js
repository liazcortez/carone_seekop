import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Divider,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { useParams } from 'react-router';
import Results from './Results';
import useMake from 'src/hooks/useMake';
import useMail from '../../../../hooks/useMail';
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const SegmentationListView = () => {
  const classes = useStyles();
   const { getMakes, makes } = useMake();
   const {segmentations, getSegmentations} = useMail();

  useEffect(() => {
    getMakes();
    console.log('here');
    getSegmentations();
    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="Segmentation list">
      <Container maxWidth={false}>
        {/* <Header /> */}
        <Box mt={3}>
          <Results makes={segmentations} />
        </Box>
      </Container>
    </Page>
  );
};

export default SegmentationListView;
