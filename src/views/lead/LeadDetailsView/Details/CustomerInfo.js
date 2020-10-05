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
  colors,
  makeStyles
} from '@material-ui/core';
import NumberFormat from 'react-number-format';
import moment from 'moment';
const useStyles = makeStyles(theme => ({
  root: {},
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  }
}));

const CustomerInfo = ({ customer, className, ...rest }) => {
  const classes = useStyles();
  
  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
      style={{ padding: '1em' }}
    >
      <CardHeader title="Customer info" />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Name</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.name}
              </Typography>
              {/* <Label color={customer.isVerified ? 'success' : 'error'}>
                {customer.isVerified ? 'Email verified' : 'Email not verified'}
              </Label> */}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Last Name</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.apPaterno + ' ' + customer.apMaterno}
              </Typography>
              {/* <Label color={customer.isVerified ? 'success' : 'error'}>
                {customer.isVerified ? 'Email verified' : 'Email not verified'}
              </Label> */}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Email</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.email}
              </Typography>
              {/* <Label color={customer.isVerified ? 'success' : 'error'}>
                {customer.isVerified ? 'Email verified' : 'Email not verified'}
              </Label> */}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Phone(s)</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.phone}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.phone2}
              </Typography>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Make</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer &&
                  customer.vehicle &&
                  customer.vehicle.make &&
                  customer.vehicle.make.name}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Model</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.vehicle && customer.vehicle.model}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Year</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.vehicle && customer.vehicle.year}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Source</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.source && customer.source.name}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Type</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer && customer.vehicle && customer.vehicle.modelType}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Store</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {`${customer &&
                  customer.store &&
                  customer.store.make &&
                  customer.store.make.name} ${customer &&
                  customer.store &&
                  customer.store.name}`}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Down Payment</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {customer &&
                  <NumberFormat value={customer.downPayment} displayType={'text'} thousandSeparator={true} prefix={'$'}/> 
                }
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Timeframe</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                    {customer && customer.timeFrame && customer.timeFrame ?
                        (
                          moment(customer.timeFrame).isSame(moment(), 'day') ? moment(customer.timeFrame).calendar() :
                          moment(customer.timeFrame).diff(moment(), 'days') >= 1  && 
                          moment(customer.timeFrame).diff(moment(), 'days') < 8 ? moment(customer.timeFrame).calendar() : 
                          moment(customer.timeFrame).format('ll')
                        ): 'None'
                        } 
              </Typography>
            </TableCell>
          </TableRow>
          {
            customer && customer.agent && customer.agent.name ? (
              <TableRow>
              <TableCell className={classes.fontWeightMedium}>Assigned</TableCell>
              <TableCell>
                <Typography variant="body2" color="textSecondary">
                  {customer.agent.name}
                </Typography>
              </TableCell>
            </TableRow>
            ) : false
          }
          <TableRow>
              <TableCell className={classes.fontWeightMedium}>Rating</TableCell>
              <TableCell>
                <Typography variant="body2" style={{color:
                  customer.rating === 'cold' ? colors.blue[500] :
                  customer.rating === 'warm' ? '#ff9800' :
                  customer.rating === 'hot' ? '#f44336' : 'primary'
                }}>
                  {customer && customer.rating}
                </Typography>
              </TableCell>
            </TableRow>
          <TableRow>
              <TableCell className={classes.fontWeightMedium}>Updated At</TableCell>
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
