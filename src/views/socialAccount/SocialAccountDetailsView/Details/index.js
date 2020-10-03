import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, makeStyles } from '@material-ui/core';
import SocialAccountInfo from './SocialAccountInfo';
import DeleteSocialAccount from './DeleteSocialAccount';
import UpdateStore from './UpdateStore';
import UpdateCategory from './UpdateCategory';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Details = ({  socialAccount, className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      spacing={3}
      {...rest}
    >
      <Grid item lg={9} md={9} xl={9} xs={12}>
        <SocialAccountInfo socialAccount={socialAccount}/>
      </Grid>    
      <Grid item lg={3} md={3} xl={3} xs={12}>
        <DeleteSocialAccount style={{ marginBottom: '1em' }}/>
        <UpdateStore style={{ marginBottom: '1em' }}/>
        <UpdateCategory style={{ marginBottom: '1em' }}/>
      </Grid>
    </Grid>
  );
};

Details.propTypes = {
  className: PropTypes.string,
  socialAccount: PropTypes.object.isRequired
  
};

export default Details;
