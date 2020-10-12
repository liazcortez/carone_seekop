import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Divider,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import useSetting from 'src/hooks/useSetting';
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

const SettingDetailsView = () => {
  const classes = useStyles();
  const { setting, getSetting } = useSetting();

  const { id } = useParams();

  useEffect(() => {

    getSetting(id);

    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="Setting Details">
      <Container maxWidth={false}>
        <Header setting={setting} />
        <Divider />
        <Box mt={3}>
          <Details setting={setting} />
        </Box>
      </Container>
    </Page>
  );
};

export default SettingDetailsView;
