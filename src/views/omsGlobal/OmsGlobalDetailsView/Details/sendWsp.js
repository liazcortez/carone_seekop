import React, { useState, useEffect } from 'react';
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
  TextField,
} from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
import useConversation from 'src/hooks/useConversations';
import { MessageCircle as MailIcon } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { CapitalizeNames } from 'src/utils/capitalize'; 

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

const SendEmail = ({ className, customer, setMailOpen, ...rest }) => {
  const classes = useStyles();
  const [callPhone, setCallPhone] = useState('');
  const { user } = useAuth();
  const { sendTemplate } = useConversation();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const templates = [
    {value: "StartConversation", title: t("TwilioTemplates.StartConversation")},
  ]
  const [template, setTemplate] = useState(templates[0].value);

  const submit = async () => {
      enqueueSnackbar(t('SnackBar.MessageSent'), {
        variant: 'success'
      });
      if(user.role === 'rockstar' || user.role === 'super admin'){
        sendTemplate('+17372527075', customer, template, user.name, callPhone, user._id);
      }else{
        sendTemplate(user.store.twilioNumber, customer,  template, user.name, callPhone, user._id);
      }
  };

  useEffect(() => {
    if(customer){
      setCallPhone(customer.phone)
    }
  }, [customer])

  if(customer.phone === 'na' || customer.phone === ''){
    return null;
  }

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title={t('Leads.SendWsp')} />
      <Divider />
      <CardContent>
        <Box>
        <TextField
          fullWidth
          onChange={(e) => { setTemplate(e.target.value) }}
          select
          variant="outlined"
          SelectProps={{ native: true }}
          style={{marginBottom: '1em'}}
         >
            {templates.map(template => (
              <option key={ template.value } value={ template.value }>
                {`${CapitalizeNames(template.title)}`}
              </option>
            ))}
         </TextField>
         <TextField
            style={{marginBottom: '1em'}}
            fullWidth
            onChange={(e)=>{ 
              setCallPhone(e.target.value)
            }}
            select
            variant="outlined"
            SelectProps={{ native: true }}
            >
            <option key={0} value={customer.phone}>{customer.phone}</option>
            {
              customer && customer.phone2 && customer.phone2 !== 'na' ? (
                <option key={1} value={customer.phone2}>{customer.phone2}</option>
              ) : false
            }
          </TextField>
          <Button
            variant="contained"
            type="submit"
            size="large"
            fullWidth
            color="primary"
            onClick={submit}
            startIcon={<MailIcon />}
          >
            {t('Leads.SendWsp')}
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
