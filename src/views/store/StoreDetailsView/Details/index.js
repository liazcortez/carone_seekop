import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, makeStyles } from '@material-ui/core';
import StoreInfo from './StoreInfo';
import DeleteStore from './DeleteStore';
import UpdateMake from './UpdateMake';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Details = ({  store, className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      spacing={3}
      {...rest}
    >
      <Grid item lg={9} md={9} xl={9} xs={12}>
        <StoreInfo store={store}/>
      </Grid>    
      <Grid item lg={3} md={3} xl={3} xs={12}>
        <DeleteStore style={{ marginBottom: '1em' }}/>
        <UpdateMake style={{ marginBottom: '1em' }}/>
      </Grid>
    </Grid>
  );
};

Details.propTypes = {
  className: PropTypes.string,
  
};

export default Details;
