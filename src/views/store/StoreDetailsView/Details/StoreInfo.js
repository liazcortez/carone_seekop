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
import moment from 'moment'
import {Capitalize, CapitalizeNames} from 'src/utils/capitalize';
const useStyles = makeStyles(theme => ({
  root: {},
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  }
}));

const StoreInfo = ({ store, className, ...rest }) => {
  const classes = useStyles();
  const { t } = useTranslation()

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title={t("Stores.Info")} />
      <Divider />
      <Table>
        <TableBody>
        <TableRow>
            <TableCell className={classes.fontWeightMedium}>ID</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
              {store && store._id ? store._id : ''}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Stores.Make")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
              {store && store.make && store.make.name ? CapitalizeNames(store.make.name) : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Stores.Store")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {store && store.name ? CapitalizeNames(store.name) : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Stores.Address")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {store && store.address  ? Capitalize(store.address) : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Stores.Phone")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {store && store.phone ? store.phone : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Stores.CreatedAt")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {store && store.createdAt ? moment(store.createdAt).format('ll') : '- - -'}
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

StoreInfo.propTypes = {
  className: PropTypes.string,
};

export default StoreInfo;
