import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Spinner from 'src/components/Spinner';
import useLead from 'src/hooks/useLead';

import {
  Avatar,
  Box,
  Card,
  Typography,
  makeStyles
} from '@material-ui/core';
import { DollarSign as SoldIcon } from 'react-feather';
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    marginLeft: theme.spacing(1)
  },
  avatar: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.secondary.contrastText,
    height: 48,
    width: 48
  }
}));

const NewLeads = ({ className, dateF,...rest }) => {
  const classes = useStyles();
  const { newS, sold, follow, date } = useLead();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box flexGrow={1}>
        <Typography
          component="h3"
          gutterBottom
          variant="overline"
          color="textSecondary"
        >
          Sold Leads
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
        >
          <Typography
            variant="h3"
            color="textPrimary"
          >
          {(newS !== undefined && sold !== undefined && follow !== undefined && date !== undefined ) ? rest.sold : <Spinner width={25}/> }
          </Typography>
        </Box>
      </Box>
      <Avatar className={classes.avatar}>
        <SoldIcon />
      </Avatar>
    </Card>
  );
};

NewLeads.propTypes = {
  className: PropTypes.string
};

export default NewLeads;
