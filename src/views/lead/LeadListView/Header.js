import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Breadcrumbs,
  Button,
  Grid,
  SvgIcon,
  Typography,
  makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  PlusCircle as PlusCircleIcon,
} from 'react-feather';
import useAuth from 'src/hooks/useAuth';
const useStyles = makeStyles((theme) => ({
  root: {},
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  }
}));

const Header = ({ className, ...rest }) => {
  const classes = useStyles();
  const { user } = useAuth();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      justify="space-between"
      spacing={3}
      {...rest}
    >
      <Grid item>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
         
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Management
          </Typography>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Leads
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          All Leads
        </Typography>
        {/* 
        <Box mt={2}>
          <Button startIcon={
            <SvgIcon fontSize="small">
              <UploadIcon />
            </SvgIcon>
          }>
            Import
          </Button>
          <Button startIcon={
            <SvgIcon fontSize="small">
              <DownloadIcon />
            </SvgIcon>
          }>
            Export
          </Button>
        </Box>*/}
      </Grid>
      {user && user.role && (user.role !== 'user' ) ?
      (<Grid item>
        <Button
          color="secondary"
          variant="contained"
          startIcon={
            <SvgIcon fontSize="small">
              <PlusCircleIcon />
            </SvgIcon>
          }
          component={RouterLink}
          to="/app/create/lead"
        >
        
            New Lead
        </Button>
      </Grid>) : false}
    </Grid>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
