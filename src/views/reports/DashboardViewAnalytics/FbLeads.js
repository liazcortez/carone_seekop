import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Spinner from 'src/components/Spinner';
import {
  Avatar,
  Box,
  Card,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';

import NumberFormat from 'react-number-format';

import { Facebook as FbIcon } from 'react-feather';
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
    backgroundColor: colors.blue[500],
    color: theme.palette.secondary.contrastText,
    height: 48,
    width: 48
  }
}));

const NewLeads = ({ className, title, dateF, ...rest }) => {
  const classes = useStyles();
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
          Facebook Leads
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
            
            {rest.data ? 
              <NumberFormat value={rest.data} displayType={'text'} thousandSeparator={true} /> : 
              <Spinner width={25}/> 
            }
          </Typography>
        </Box>
      </Box>
      <Avatar className={classes.avatar}>
        <FbIcon />
      </Avatar>
    </Card>
  );
};

NewLeads.propTypes = {
  className: PropTypes.string
};

export default NewLeads;
