import React, { useEffect } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Results from './Results';
import useVehicle from 'src/hooks/useVehicle';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const VehicleListView = () => {
  const classes = useStyles();

  const { getVehicles, vehicles } = useVehicle();

  useEffect(() => {
    getVehicles();
    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="Vehicles List">
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results vehicles={vehicles} />
        </Box>
      </Container>
    </Page>
  );
};

export default VehicleListView;
