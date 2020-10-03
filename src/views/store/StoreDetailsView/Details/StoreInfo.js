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

const useStyles = makeStyles(theme => ({
  root: {},
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  }
}));

const StoreInfo = ({ store, className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Store info" />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Make</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
              {store && store.make ? store.make.name : ''}

              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Store</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {store && store.name ? store.name : ''}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Address</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {store && store.address  ? store.address : ''}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Phone</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {store && store.phone ? store.phone : ''}
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
