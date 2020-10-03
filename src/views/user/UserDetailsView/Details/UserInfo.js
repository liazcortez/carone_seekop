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

const UserInfo = ({ user, className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Customer info" />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Name</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {user && user.name ? user.name : 'None'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Store</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {user &&  user.store && user.store.make && user.store.make.name ? user.store.make.name + ' ' : '' }
                {user &&  user.store && user.store.name ? user.store.name : 'None'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Email</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {user &&  user.email ? user.email : 'None'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Role</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {user && user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'None'}
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

UserInfo.propTypes = {
  className: PropTypes.string,
};

export default UserInfo;
