import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, makeStyles } from '@material-ui/core';
import MakeInfo from './MakeInfo';
import DeleteMake from './DeleteMake';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Details = ({  make, className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      spacing={3}
      {...rest}
    >
      <Grid item lg={9} md={9} xl={9} xs={12}>
        <MakeInfo make={make}/>
      </Grid>    
      <Grid item lg={3} md={3} xl={3} xs={12}>
        <DeleteMake />
      </Grid>
    </Grid>
  );
};

Details.propTypes = {
  className: PropTypes.string,
  
};

export default Details;
