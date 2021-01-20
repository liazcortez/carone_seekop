import React from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Breadcrumbs,
  Button,
  Grid,
  SvgIcon,
  Typography,
  makeStyles,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { ArrowLeft as BackIcon } from 'react-feather';

import { useTranslation } from 'react-i18next';

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

const Header = ({ className, ...rest }) => {
  const classes = useStyles();
  const { t } = useTranslation()
  const history = useHistory();

  const handleBack = () =>{
    history.goBack();
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

        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
            <Typography
            variant="body1"
            color="textPrimary"
          >
            {t("BreadCumbs.Management")}
          </Typography>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            {t("BreadCumbs.Leads")}
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          {t("Csv.Title")}
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
          onClick={handleBack}
        >
        
        {t("Buttons.GoBack")}
        </Button>
      </Grid>
    </Grid>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;
