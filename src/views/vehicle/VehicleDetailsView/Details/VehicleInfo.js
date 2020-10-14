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
import NumberFormat from 'react-number-format';
const useStyles = makeStyles(theme => ({
  root: {},
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  }
}));

const VehicleInfo = ({ vehicle, className, ...rest }) => {
  const classes = useStyles();
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Vehicle info" />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Model</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {vehicle && vehicle.model ? vehicle.model : 'No Model'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Model Type</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {vehicle && vehicle.modelType ? vehicle.modelType.charAt(0).toUpperCase() + vehicle.modelType.slice(1) : 'No Model Type'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Mode Description</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {vehicle && vehicle.modeDescription ? vehicle.modeDescription : 'No Mode Description'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Year</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {vehicle && vehicle.year ? vehicle.year : 'No Year'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Description</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {vehicle && vehicle.description ? vehicle.description : 'No Description'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Make</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {vehicle && vehicle.make ? vehicle.make.name : 'No Make'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Serie</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {vehicle && vehicle.serie ? vehicle.serie : 'No Serie'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Key</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {vehicle && vehicle.key ? vehicle.key : 'No Key'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Color</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {vehicle && vehicle.color ? vehicle.color : 'No Color'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Inventory</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {vehicle && vehicle.inventory ? vehicle.inventory : 'No Inventory'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Price</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {vehicle && vehicle.price ? 
                  <NumberFormat value={vehicle.price} displayType={'text'} thousandSeparator={true} prefix={'$'}/> : 'No Price'
                }
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
