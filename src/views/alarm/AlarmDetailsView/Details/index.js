import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, makeStyles } from '@material-ui/core';
import Alarms from './Alarms';
import StartCron from './StartCron';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Details = ({ stores, ArrayBol, className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      spacing={3}
      {...rest}
    >
      <Grid item lg={9} md={9} xl={9} xs={12}>
        <Alarms stores={stores} ArrayBol={ArrayBol}/>
      </Grid>    
      <Grid item lg={3} md={3} xl={3} xs={12}>
        <StartCron />
      </Grid>
    </Grid>
  );
};

Details.propTypes = {
  className: PropTypes.string,
  
};

export default Details;
