import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// import { useSnackbar } from 'notistack';
// import api from 'src/api/api';
// import useLead from 'src/hooks/useLead';
// import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  // FormHelperText,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
  // TextField
} from '@material-ui/core';
import { Mail as MailIcon } from 'react-feather';

const useStyles = makeStyles(theme => ({
  root: {},
  cell: {
    padding: theme.spacing(1)
  },
  error: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: '#d0392e'
    }
  }
}));

const SendEmail = ({ className, setMailOpen, ...rest }) => {
  const classes = useStyles();
  // const { lead } = useLead();

  // const { enqueueSnackbar } = useSnackbar();
  const handleOpen = () => {
    setMailOpen(true)
  }

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Documentation" />
      <Divider />
      <CardContent>
        <Box mt={2}>
          <Button
            variant="contained"
            type="submit"
            size="large"
            fullWidth
            color="primary"
            startIcon={<MailIcon />}
            onClick={handleOpen}
          >
            Documentation
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

SendEmail.propTypes = {
  className: PropTypes.string
};

export default SendEmail;
