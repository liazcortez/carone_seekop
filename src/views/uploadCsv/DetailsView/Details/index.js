import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, makeStyles } from '@material-ui/core';
import Form from './Form';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Details = ({ stores, className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      spacing={3}
      {...rest}
    >
      <Grid item lg={12} md={12} xl={12} xs={12}>
        <Form />
      </Grid>
    </Grid>
  );
};

Details.propTypes = {
  className: PropTypes.string,
  
};

export default Details;
