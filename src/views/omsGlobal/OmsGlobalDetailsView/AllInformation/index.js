import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, makeStyles } from '@material-ui/core';
import ModelInfo from './ModelInfo';
import FaauInfo from './FaauInfo';

const useStyles = makeStyles(theme => ({
  root: {},
  call: {
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  }
}));

const Details = ({ customer, className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      spacing={3}
      {...rest}
    >
      <Grid item lg={6} md={6} xl={6} xs={12}>
        <ModelInfo customer={customer} />
      </Grid>
      <Grid item lg={6} md={6} xl={6} xs={12}>
        <FaauInfo customer={customer} />
      </Grid>
    </Grid>
  );
};

Details.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.object.isRequired
};

export default Details;
