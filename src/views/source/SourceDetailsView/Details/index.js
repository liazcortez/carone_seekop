import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, makeStyles } from '@material-ui/core';
import SourceInfo from './SourceInfo';
import DeleteSource from './DeleteSource';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Details = ({  source, className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      spacing={3}
      {...rest}
    >
      <Grid item lg={9} md={9} xl={9} xs={12}>
        <SourceInfo source={source}/>
      </Grid>    
      <Grid item lg={3} md={3} xl={3} xs={12}>
        <DeleteSource />
      </Grid>
    </Grid>
  );
};

Details.propTypes = {
  className: PropTypes.string,
  source: PropTypes.object.isRequired
  
};

export default Details;
