import React, {
  useEffect
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import SettingEditForm from './SettingEditForm'
import Header from './Header';
import useSetting from 'src/hooks/useSetting';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const SettingEditView = () => {
  const classes = useStyles();
  const { getSetting, setting } = useSetting();

  const route = useParams();


  useEffect(() => {
    
    getSetting(route.id);
    // eslint-disable-next-line
  }, []);

  return (
    <Page
      className={classes.root}
      title="Setting Edit"
    >
      <Container maxWidth={false}>
        <Header />
      </Container>
      <Box mt={3}>
        <Container maxWidth="lg">
          <SettingEditForm setting={setting} />
        </Container>
      </Box>
    </Page>
  );
};

export default SettingEditView;
