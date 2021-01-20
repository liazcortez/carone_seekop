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
import { useTranslation } from 'react-i18next';
import {Capitalize, CapitalizeNames} from 'src/utils/capitalize';

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
      <CardHeader title={t("OmsGlobals.ModelInfo")} />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.ModeDescription")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && CapitalizeNames(customer.modeDescription)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.ModeType")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && Capitalize(customer.modeType)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.DescModel")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.descModel && Capitalize(customer.descModel)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.Color")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.color && Capitalize(customer.color)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.Key")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.key ? customer.key : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.Serie")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.serie ? customer.serie : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.Inventory")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.inventory ? customer.inventory : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.Year")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.year ? customer.year : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("OmsGlobals.YearModel")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.yearModel ? customer.yearModel : '- - -'}
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
