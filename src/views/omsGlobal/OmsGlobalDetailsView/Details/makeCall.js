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
  makeStyles,
  TextField
} from '@material-ui/core';
import { CapitalizeNames } from 'src/utils/capitalize';
import useOmsGlobal from 'src/hooks/useOmsGlobal';
import { Phone as CallIcon } from 'react-feather';
import { PhoneMissed as PhoneMissedIcon } from 'react-feather';
import useActivity from 'src/hooks/useActivity';
import { useTranslation } from 'react-i18next';
import { Device } from 'twilio-client';
import useComment from 'src/hooks/useComment';
import { useParams } from 'react-router-dom';

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
  const [callPhone, setCallPhone] = useState('');
  const { callToken } = useOmsGlobal();

  const [callStatus, setCallStatus] = useState('');


  const { createComment, getCommentsByLead, getCommentsByOmsGlobal, getCommentsByQuestLead } = useComment();

  const route = useParams();
  const updateCallStatus = status => {
    setCallStatus(status);
  };

  useEffect(() => {
    if (customer) {
      setCallPhone(customer.phone);
    }
  }, [customer]);

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

  const callCustomer = async obj => {
    console.log(obj);

    updateCallStatus(t('Leads.Calling') + obj.phoneNumber + '...');
    const params = { phoneNumber: obj.phoneNumber };
    device.connect(params);
    // comment: 'llamar al lead',
    // action: [ 'calling' ],
    // global: '60f0b17981c59d8617d79da4',
    // type: 'global',
    // assignedBy: '60f0836322ec8c5a474d4819'
    const callDetail = `${obj.description} from ${obj.phoneNumber}`;
    let type = 'global';
    await createComment(
      {
        comment: callDetail,
        user: user._id,
        actions: {
          calling: true
        },
        type: type
      },
      route.id
    );
    if (type === 'lead') {
      await getCommentsByLead(route.id);
    } else if (type === 'global') {
      await getCommentsByOmsGlobal(route.id);
    } else {
      await getCommentsByQuestLead(route.id);
    }
    createActivity(obj);
  };

  /* End a call */
  const hangUp = () => {
    device.disconnectAll();
  };

  if (customer.phone === 'na' || customer.phone === '') {
    return null;
  }

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader
        title={`${t('Leads.Call')} ${t('Leads.CallStatus')}: ${callStatus}`}
      />
      <Divider />
      <CardContent>
        <Box mt={2}>
          <TextField
            fullWidth
            onChange={e => {
              setCallPhone(e.target.value);
            }}
            select
            variant="outlined"
            SelectProps={{ native: true }}
          >
            <option key={0} value={customer.phone}>
              {customer.phone}
            </option>
            {customer && customer.phone2 && customer.phone2 !== 'na' ? (
              <option key={1} value={customer.phone2}>
                {customer.phone2}
              </option>
            ) : (
              false
            )}
          </TextField>
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
                phoneNumber: callPhone,
                description: `${user.name} has made a phone call ${
                  customer.name !== 'na'
                    ? 'to ' + CapitalizeNames(customer.name)
                    : ''
                }`,
                action: 'call',
                global: customer._id
              })
            }
            style={{ marginTop: '1em', backgroundColor: '#48c357' }}
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
