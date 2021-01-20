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
import {Capitalize, CapitalizeNames} from 'src/utils/capitalize';

const useStyles = makeStyles(theme => ({
  root: {},
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  },
  capitalize: {
    'text-transform': 'Capitalize',
  },
}));

const CustomerInfo = ({ customer, className, ...rest }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
      style={{ padding: '1em' }}
    >
      <CardHeader title={t("OmsGlobals.Info")} />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.Name")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.name ? CapitalizeNames(customer.name) + ' ': ''}
                {
                  customer && customer.name !== 'na' ? CapitalizeNames(customer.apPaterno) : ''
                }
                {
                  customer && customer.name !== 'na' ? CapitalizeNames(customer.apMaterno) : ''
                }
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.Email")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && Capitalize(customer.email)}
              </Typography>
            </TableCell>
          </TableRow>
          {customer && customer.phone && customer.phone !== 'na' ? (
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.Phone")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.phone}
                {customer && customer.phone2 ? (<br />) : false}
                {customer && customer.phone2 && customer.phone2 !== 'na' ?  customer.phone2 : false}
              </Typography>
            </TableCell>
          </TableRow>
          ):null}

          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Companies.Company")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer &&
                  customer.company &&
                  CapitalizeNames(customer.company.name)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.Make")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {
                  customer &&
                  customer.make &&
                  customer.make.name &&
                  CapitalizeNames(customer.make.name)
                }
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
              <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.Updated")}</TableCell>
              <TableCell>
                <Typography variant="body2" color="textSecondary">
                  {customer && moment(customer.updatedAt).format('ll')}
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

CustomerInfo.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.object.isRequired
};

export default CustomerInfo;
