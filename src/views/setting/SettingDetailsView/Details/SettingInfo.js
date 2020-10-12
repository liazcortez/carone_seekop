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

import moment from 'moment';
const useStyles = makeStyles(theme => ({
  root: {},
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  },
  download: {
    color: theme.palette.text.primary
  }
}));

const SettingInfo = ({ setting, className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Setting info" />
      <Divider />
      <Table>
        <TableBody>
        <TableRow>
            <TableCell className={classes.fontWeightMedium}>Store</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {setting && setting.store && setting.store.make ? setting.store.make.name + ' ' + setting.store.name : ''}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Cold</TableCell>
            <TableCell>
              <Typography variant='body2' color="textSecondary">Time: +{setting && setting.cold ? setting.cold.time : ''} months</Typography>
              <Typography variant='body2' color="textSecondary">
                Down Payment: -<NumberFormat value={setting && setting.cold ? setting.cold.downPayment : ''} displayType={'text'} thousandSeparator={true} prefix={'$'}/> 
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Warm</TableCell>
            <TableCell>
              <Typography variant='body2' color="textSecondary">Time: {setting && setting.warm ? setting.warm.time : ''} months</Typography>
              <Typography variant='body2' color="textSecondary">
                Down Payment: <NumberFormat value={setting && setting.warm ? setting.warm.downPayment : ''} displayType={'text'} thousandSeparator={true} prefix={'$'}/> 
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Hot</TableCell>
            <TableCell>
              <Typography variant='body2' color="textSecondary">Time: {setting && setting.hot ? setting.hot.time : ''} months</Typography>
              <Typography variant='body2' color="textSecondary">
                Down Payment: +<NumberFormat value={setting && setting.hot ? setting.hot.downPayment : ''} displayType={'text'} thousandSeparator={true} prefix={'$'}/> 
              </Typography>
            </TableCell>
          </TableRow>
         
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Created At</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {setting && setting.createdAt ? moment(setting.createdAt).format('ll') : ''}
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

SettingInfo.propTypes = {
  className: PropTypes.string,
  setting: PropTypes.object.isRequired
};

export default SettingInfo;
