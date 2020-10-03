import React, {
  useEffect
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import VehicleEditForm from './VehicleEditForm';
import Header from './Header';
import useVehicle from 'src/hooks/useVehicle';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const VehicleEditView = () => {
  const classes = useStyles();
  const { getVehicle, vehicle } = useVehicle();

  const route = useParams();


  useEffect(() => {
    
    getVehicle(route.id);
    // eslint-disable-next-line
  }, []);

  return (
    <Page
      className={classes.root}
      title="Vehicle Edit"
    >
      <Container maxWidth={false}>
        <Header />
      </Container>
      <Box mt={3}>
        <Container maxWidth="lg">
          <VehicleEditForm vehicle={vehicle} />
        </Container>
      </Box>
    </Page>
  );
};

export default VehicleEditView;
