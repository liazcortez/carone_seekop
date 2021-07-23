import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles
} from '@material-ui/core';

import useUtils from 'src/hooks/useUtils';
import useQuestLead from 'src/hooks/useQuestLead';
import { Phone as CallIcon } from 'react-feather';
import { PhoneMissed as PhoneMissedIcon } from 'react-feather';
import useActivity from 'src/hooks/useActivity';
import { useTranslation } from 'react-i18next';
import { Device } from 'twilio-client';
import { CapitalizeNames } from 'src/utils/capitalize';

const useStyles = makeStyles(theme => ({
  root: {},
  cell: {
    padding: theme.spacing(1)
  }
}));

let device;

const MakeCall = ({ className, customer, user, ...rest }) => {
  const classes = useStyles();

  const { createActivity } = useActivity();
  const { t } = useTranslation();

  const { callToken } =useQuestLead();

  const [callStatus, setCallStatus] = useState('');

  const updateCallStatus = status => {
    setCallStatus(status);
  };

  useEffect(() => {
    if (callToken) {
      try {
        device = new Device(callToken, {
          codecPreferences: ['opus', 'pcmu'],
          fakeLocalDTMF: true,
          enableRingingState: true
        });

        device.on('ready', function(device) {
          console.log('Twilio.Device Ready!');
          updateCallStatus(t('Leads.CallReady'));
        });

        device.on('error', function(error) {
          console.log('Twilio.Device Error: ' + error.message);
          updateCallStatus('ERROR: ' + error.message);
        });

        device.on('connect', function(conn) {
          console.log('Successfully established call!');
          updateCallStatus(t('Leads.CallInCall') + conn.message.phoneNumber);
        });

        device.on('disconnect', function(conn) {
          updateCallStatus(t('Leads.CallReady'));
        });
      } catch (err) {
        setCallStatus('ERROR: ', err.message);
        console.log(err);
      }
    }
    //eslint-disable-next-line
  }, [callToken]);

  const callCustomer = obj => {
    updateCallStatus(t('Leads.Calling') + obj.phoneNumber + '...');
    const params = { phoneNumber: obj.phoneNumber };
    device.connect(params);
    createActivity(obj);
  };

  /* End a call */
  const hangUp = () => {
    device.disconnectAll();
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader
        title={`${t('Leads.Call')} ${t('Leads.CallStatus')}: ${callStatus}`}
      />
      <Divider />
      <CardContent>
        <Box mt={2}>
          <Button
            disabled={callStatus !== t('Leads.CallReady') ? true : false}
            variant="contained"
            type="submit"
            size="large"
            fullWidth
            color="primary"
            startIcon={<CallIcon />}
            onClick={() =>
              callCustomer({
                phoneNumber: customer.phone,
                description: `${user.name} has made a phone call to ${CapitalizeNames(customer.name)}`,
                action: 'call',
                quest: customer._id
              })
            }
            style={{ backgroundColor: '#48c357' }}
          >
            {t('Leads.MakeCall')}
          </Button>
          <Button
            disabled={callStatus === t('Leads.CallReady') ? true : false}
            variant="contained"
            type="submit"
            size="large"
            fullWidth
            color="primary"
            startIcon={<PhoneMissedIcon />}
            onClick={() => hangUp()}
            style={{ marginTop: '1em', backgroundColor: '#e61a24' }}
          >
            {t('Leads.HangUp')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

MakeCall.propTypes = {
  className: PropTypes.string
};

export default MakeCall;
