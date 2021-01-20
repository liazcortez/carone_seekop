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
import {Capitalize, CapitalizeNames} from 'src/utils/capitalize';
import { useTranslation } from 'react-i18next';
import moment from 'moment'
const useStyles = makeStyles(theme => ({
  root: {},
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  }
}));

const VehicleInfo = ({ vehicle, className, ...rest }) => {
  const classes = useStyles();
  const { t } = useTranslation()
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title={t("Vehicles.Info")} />
      <Divider />
      <Table>
        <TableBody>
        <TableRow>
            <TableCell className={classes.fontWeightMedium}>ID</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {vehicle && vehicle._id ? vehicle._id : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Vehicles.Model")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {vehicle && vehicle.model ? CapitalizeNames(vehicle.model) : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Vehicles.ModelType")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {vehicle && vehicle.modelType ? Capitalize(vehicle.modelType) : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Vehicles.Description")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {vehicle && vehicle.description ? Capitalize(vehicle.description) : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Vehicles.Make")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {vehicle && vehicle.make ? Capitalize(vehicle.make.name) : '- - -'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>{t("Vehicles.CreatedAt")}</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {vehicle && vehicle.createdAt ? moment(vehicle.createdAt).format('ll') : '- - -'}
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

VehicleInfo.propTypes = {
  className: PropTypes.string,
  vehicle: PropTypes.object.isRequired
};

export default VehicleInfo;
