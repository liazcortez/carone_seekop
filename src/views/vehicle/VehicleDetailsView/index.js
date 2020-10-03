import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Divider,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import useVehicle from 'src/hooks/useVehicle';
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

const VehicleDetailsView = () => {
  const classes = useStyles();
  const { vehicle, getVehicle } = useVehicle();

  const { id } = useParams();

  useEffect(() => {

    getVehicle(id);

    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="Vehicle Details">
      <Container maxWidth={false}>
        <Header vehicle={vehicle} />
        <Divider />
        <Box mt={3}>
          <Details vehicle={vehicle} />
        </Box>
      </Container>
    </Page>
  );
};

export default VehicleDetailsView;
