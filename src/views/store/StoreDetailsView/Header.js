import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import SimpleDialog from 'src/components/SimpleDialog'

import { useHistory, useParams } from 'react-router';
import {
  Breadcrumbs,
  Button,
  Grid,
  SvgIcon,
  Typography,
  makeStyles,
  Link
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Edit as EditIcon } from 'react-feather';
import { ArrowLeft as BackIcon } from 'react-feather';

import useAuth from 'src/hooks/useAuth';
import useLead from 'src/hooks/useLead';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  root: {},
  error: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: "#d0392e"
    },
    marginLeft: 15
  },
}));

const Header = ({ className, store, ...rest }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const { deleteLead, getLeads } = useLead();
  const { enqueueSnackbar } = useSnackbar();  
  const history = useHistory();
  const route = useParams();

  const [open, setOpen] = React.useState(false);
  const handleClose = async (value) => {
    setOpen(false);
    if(value === 'yes'){      
      deleteLead(route.id);
      getLeads();
      enqueueSnackbar('Store deleted', {
        variant: 'error'
      });
      history.push("/app/management/stores");
    }
  };


  const handleDelete = () =>{
    setOpen(true);    
  }
  
  return (
    
    <Grid
      container
      spacing={3}
      justify="space-between"
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Grid item>
      <SimpleDialog open={open} onClose={handleClose} />

        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
                   
          <Link
            variant="body1"
            color="inherit"
            to="/app/management/stores"
            component={RouterLink}
          >
            Management
          </Link>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Stores
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          {store && store.name}
        </Typography>
      </Grid>
      <Grid item>

      <Button
          color="secondary"
          variant="contained"
          startIcon={
            <SvgIcon fontSize="small">
              <BackIcon />
            </SvgIcon>
          }
          component={RouterLink}
          to="/app/management/stores"
        >
        
            Go Back
        </Button>
      { user && user.role === 'rockstar' ? (
       <> <Button
          style={{marginLeft: 15}}
          color="secondary"
          variant="contained"
          component={RouterLink}
          to={`/app/management/stores/${store && store._id}/edit`}
          startIcon={
            <SvgIcon fontSize="small">
              <EditIcon />
            </SvgIcon>
          }
        >
          Edit
        </Button>
        <Button
          className={classes.error}
          variant="contained"
          onClick={handleDelete}
          startIcon={
            <SvgIcon fontSize="small">
              <EditIcon />
            </SvgIcon>
          }
        >
          Delete
        </Button></>
      ) : false }
      </Grid>
    </Grid>
  );
};

Header.propTypes = {
  className: PropTypes.string,
  store: PropTypes.object.isRequired
};

export default Header;
