import React, {
  useEffect
} from 'react';
import {
  Box,
  Container,
  Divider,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Activity from './Activity';
import Header from './Header';
import useActivity from 'src/hooks/useActivity';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const ProjectDetailsView = () => {
  const classes = useStyles();
  const { getActivities, activities } = useActivity();

  useEffect(() =>{
    getActivities();
    //eslint-disable-next-line
  },[]);

  return (
    <Page
      className={classes.root}
      title="Project Details"
    >
      <Container maxWidth="lg">
        <Header/>
        <Divider />
        <Box mt={3}>
          <Activity activities={activities} />
        </Box>
      </Container>
    </Page>
  );
}

export default ProjectDetailsView;
