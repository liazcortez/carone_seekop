import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Link as RouterLink } from 'react-router-dom';

import {
  Breadcrumbs,
  Typography,
  makeStyles,
  Link,
  Grid,
  Button,
  SvgIcon,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { ArrowLeft as BackIcon } from 'react-feather';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
const useStyles = makeStyles(() => ({
  root: {}
}));

const Header = ({ className, ...rest }) => {
  const classes = useStyles();
  const route = useParams();
  const {t} = useTranslation()
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
          <Link
            variant="body1"
            color="inherit"
            to="/app/management/makes"
            component={RouterLink}
          >
            {t("BreadCumbs.Management")}
          </Link>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            {t("BreadCumbs.Makes")}
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          {t("BreadCumbs.Edit")} {t("Makes.Make")}
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
          to={`/app/management/makes/${route.id}`}
        >
        
        {t("Buttons.GoBack")}
        </Button>
      </Grid>
    </Grid>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
