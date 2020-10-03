import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  Typography,
  makeStyles
} from '@material-ui/core';
import Spinner from 'src/components/Spinner';
import { Calendar as CalendarIcon } from 'react-feather';
import useLead from 'src/hooks/useLead';
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
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    height: 48,
    width: 48
  }
}));

const MonthLeads = ({ className , title,...rest }) => {
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
          {`${title}`}
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
            {(newS !== undefined && sold !== undefined && follow !== undefined && date !== undefined) ? rest.date : <Spinner width={25}/> }
          </Typography>
        </Box>
      </Box>
      <Avatar className={classes.avatar}>
        <CalendarIcon />
      </Avatar>
    </Card>
  );
};

MonthLeads.propTypes = {
  className: PropTypes.string
};

export default MonthLeads;
