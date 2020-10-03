import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, makeStyles } from '@material-ui/core';
import CustomerInfo from './UserInfo';
import StatusUser from './RoleUser';
import UpdateStore from './UpdateStore';
import { useParams } from 'react-router-dom';
import DeleteUser from './DeleteUser';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Details = ({ user, className, ...rest }) => {
  const classes = useStyles();
  const route = useParams();

  useEffect(() => {
    // eslint-disable-next-line
  }, []);

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      spacing={3}
      {...rest}
    >
      <Grid item lg={9} md={9} xl={9} xs={12}>
        <CustomerInfo user={user} />
      </Grid>
      <Grid item lg={3} md={3} xl={3} xs={12}>
        <StatusUser user={route.id} style={{ marginBottom: '1em' }}/>
        <UpdateStore user={route.id} style={{ marginBottom: '1em' }}/>
        <DeleteUser style={{ marginBottom: '1em' }}/>
      </Grid>
    </Grid>
  );
};

Details.propTypes = {
  className: PropTypes.string,
};

export default Details;
