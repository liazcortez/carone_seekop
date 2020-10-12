import React, { useEffect } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Results from './Results';
import useSetting from 'src/hooks/useSetting';
// import moment from 'moment';
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const SettingListView = () => {
  const classes = useStyles();

  const { getSettings, settings } = useSetting();

  useEffect(() => {
    getSettings();
    // console.log(moment('2020-12-12').diff(moment(), 'months'))
    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="Settings List">
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results settings={settings} />
        </Box>
      </Container>
    </Page>
  );
};

export default SettingListView;
