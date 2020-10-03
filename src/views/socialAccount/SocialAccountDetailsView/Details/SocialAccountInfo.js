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

const SocialAccountInfo = ({ socialAccount, className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="SocialAccount info" />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Name</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {socialAccount && socialAccount.name ? socialAccount.name : ''}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Account</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {socialAccount && socialAccount.account ? socialAccount.account : ''}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Category</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {socialAccount && socialAccount.category ? socialAccount.category : ''}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>Store</TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {socialAccount && socialAccount.store && socialAccount.store.make ? (socialAccount.store.make.name + ' ' + socialAccount.store.name) : ''}
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

SocialAccountInfo.propTypes = {
  className: PropTypes.string,
  socialAccount: PropTypes.object.isRequired
};

export default SocialAccountInfo;
