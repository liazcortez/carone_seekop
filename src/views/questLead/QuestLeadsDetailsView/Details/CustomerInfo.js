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
import { CapitalizeNames } from 'src/utils/capitalize';

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
      <CardHeader title={t("QuestLeads.Info")} />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("QuestLeads.Name")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && CapitalizeNames(customer.name)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("QuestLeads.Email")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.email}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("QuestLeads.Phone")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.phone}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("QuestLeads.Store")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer &&
                  customer.store &&
                  CapitalizeNames(customer.store.name)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("QuestLeads.Store")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer &&
                  customer.make &&
                  CapitalizeNames(customer.make.name)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("QuestLeads.Model")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.model && CapitalizeNames(customer.model.model)}
              </Typography>
            </TableCell>
            </TableRow>
            <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("QuestLeads.Source")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.source && customer.source.name && CapitalizeNames(customer.source.name)}
              </Typography>
            </TableCell>
            </TableRow>
            <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("QuestLeads.SellerKey")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.sellerKey}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("QuestLeads.Seller")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.seller}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("QuestLeads.SellerEmail")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.sellerEmail}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("QuestLeads.TabletKey")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.idQuest}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("QuestLeads.Date")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.createdAt ? moment(customer.createdAt).format('lll') : 'None'}
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
