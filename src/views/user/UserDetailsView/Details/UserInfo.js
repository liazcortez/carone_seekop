import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {Capitalize, CapitalizeNames} from 'src/utils/capitalize';
import moment from 'moment'

const useStyles = makeStyles(theme => ({
  root: {},
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  }
}));

const UserInfo = ({ user, className, ...rest }) => {
  const classes = useStyles();
  const { t } = useTranslation()

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title={t("Users.Info")} />
      <Divider />
      <Table>
        <TableBody>
        <TableRow>
            <TableCell className={classes.fontWeightMedium}>ID</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {user && user._id ? user._id : ''}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Users.Name")} </TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {user && user.name ? CapitalizeNames(user.name) : ''}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Users.Store")} </TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {user &&  user.store && user.store.make && user.store.make.name ? CapitalizeNames(user.store.make.name) + ' ' : '' }
                {user &&  user.store && user.store.name ? CapitalizeNames(user.store.name) : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Users.Email")} </TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {user &&  user.email ? user.email : ''}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Users.Role")} </TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {user && user.role ? Capitalize(user.role) : ''}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Users.CreatedAt")} </TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {user && user.createdAt ? moment(user.createdAt).format('ll') : ''}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Box
        p={1}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
      ></Box>
    </Card>
  );
};

UserInfo.propTypes = {
  className: PropTypes.string,
};

export default UserInfo;
