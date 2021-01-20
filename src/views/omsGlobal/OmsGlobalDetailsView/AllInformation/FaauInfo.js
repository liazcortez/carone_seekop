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
  makeStyles,
} from '@material-ui/core';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { CapitalizeNames} from 'src/utils/capitalize';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '1em'
  },
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  },
  capitalize: {
    'text-transform': 'Capitalize',
  },
}));

const ModelInfo = ({ customer, className, ...rest }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
      style={{ padding: '1em' }}
    >
      <CardHeader title={t("OmsGlobals.FaauInfo")} />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.Reason")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && CapitalizeNames(customer.faauReason)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.Date")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.faauDate && moment(customer.faauDate).format('ll')}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.Payment")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && CapitalizeNames(customer.methodPayment)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.Colony")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.faauColony && CapitalizeNames(customer.faauColony)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.Seller")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && CapitalizeNames(customer.seller)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.Total")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.faauTotal}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.StateMunicipy")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.municipyName ? CapitalizeNames(customer.municipyName) + ', ' : ''}
                {customer && customer.stateName ? CapitalizeNames(customer.stateName) : ''}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.DDate")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.faauDeliveryDate ? customer.faauDeliveryDate : 'Na'}
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

ModelInfo.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.object.isRequired
};

export default ModelInfo;
