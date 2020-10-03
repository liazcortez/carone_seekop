import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, makeStyles } from '@material-ui/core';
import VehicleInfo from './VehicleInfo';
import UpdateMake from './UpdateMake';
import UpdateModelType from './UpdateModelType';
import DeleteVehicle from './DeleteVehicle';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Details = ({  vehicle, className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      spacing={3}
      {...rest}
    >
      <Grid item lg={9} md={9} xl={9} xs={12}>
        <VehicleInfo vehicle={vehicle}/>
      </Grid>    
      <Grid item lg={3} md={3} xl={3} xs={12}>
        <DeleteVehicle style={{marginBottom: '1em'}}/>
        <UpdateMake style={{marginBottom: '1em'}}/>
        <UpdateModelType style={{marginBottom: '1em'}}/>
      </Grid>
    </Grid>
  );
};

Details.propTypes = {
  className: PropTypes.string,
  vehicle: PropTypes.object.isRequired
  
};

export default Details;
