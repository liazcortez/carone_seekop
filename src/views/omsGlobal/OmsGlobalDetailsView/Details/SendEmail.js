import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
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
  const { t } = useTranslation();

  const handleOpen = () => {
    setMailOpen(true)
  }

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title={t("Buttons.Documentation")} />
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
            {t("Buttons.Documentation")}
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
