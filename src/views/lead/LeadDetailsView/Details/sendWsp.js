import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
  TextField
} from '@material-ui/core';
import useLead from 'src/hooks/useLead';
import { MessageCircle as MailIcon } from 'react-feather';

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

const SendEmail = ({ className, customer,setMailOpen, ...rest }) => {
  const classes = useStyles();
  const { sendWsp } = useLead();
  const { enqueueSnackbar } = useSnackbar();
  const [msg, setMsg] = useState('')

  const handleChange = (e)=>{
    setMsg(e.target.value)
  }

  const submit = async()=>{
    if(msg !== ''){
      enqueueSnackbar('Message sent', {
        variant: 'success'
      });
      await sendWsp({body: msg, phone: customer.phone})
      setMsg('')
    }
  } 

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Send Wsp" />
      <Divider />
      <CardContent>
        <Box>
        <TextField
        style={{ marginBottom: '1em' }}
          fullWidth
          onChange={handleChange}
          required
          variant="outlined"
          value={msg}
          />
          <Button
            variant="contained"
            type="submit"
            size="large"
            fullWidth
            color="primary"
            onClick={submit
            }
            startIcon={<MailIcon />}
          >
            Send Wsp
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
