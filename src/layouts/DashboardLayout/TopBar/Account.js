import React, { useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  ButtonBase,
  Hidden,
  Menu,
  MenuItem,
  Typography,
  makeStyles
} from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
import { CapitalizeNames } from 'src/utils/capitalize';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  avatar: {
    height: 32,
    width: 32,
    marginRight: theme.spacing(1)
  },
  popover: {
    width: 200
  }
}));

const Account = () => {
  const classes = useStyles();
  const ref = useRef(null);
  const { t } = useTranslation()
  const { user } = useAuth();
  const [isOpen, setOpen] = useState(false);

  const { logout } = useAuth();
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  if (!localStorage.getItem('token')) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        component={ButtonBase}
        onClick={handleOpen}
        ref={ref}
      >
        <Avatar
          alt="User"
          className={classes.avatar}
          src={user && user.image ? `${process.env.REACT_APP_URL_IMAGE_S3_URL}${user.image}` : ''}
        />
        <Hidden smDown>
          <Typography variant="h6" color="inherit">
            {user ? CapitalizeNames(user.name) : ''}
          </Typography>
        </Hidden>
      </Box>
      <Menu
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        keepMounted
        PaperProps={{ className: classes.popover }}
        getContentAnchorEl={null}
        anchorEl={ref.current}
        open={isOpen}
      >
       
        <MenuItem component={RouterLink} to="/app/account">
        {t("Account.Account")}
        </MenuItem>
        <MenuItem onClick={handleLogout}>{t("Account.Logout")}</MenuItem>
      </Menu>
    </>
  );
};

export default Account;
