import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Divider,
  Tab,
  Tabs,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Details from './Details';
import Activities from './Activity';
import useOmsGlobal from 'src/hooks/useOmsGlobal';
import useActivity from 'src/hooks/useActivity';
import useDocument from 'src/hooks/useDocument';
import { useParams } from 'react-router';
import useStatus from 'src/hooks/useStatus';
import { useTranslation } from 'react-i18next';
import AllInfo from './AllInformation';
import useComment from 'src/hooks/useComment';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const CustomerDetailsView = () => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState('details');
  const {
    omsGlobal,
    getOmsGlobal,
    updateOmsGlobal,
    generateToken
  } = useOmsGlobal();
  const { setComments } = useComment();
  const { statuses, getStatuses } = useStatus();
  const { clearState } = useDocument();
  const { t } = useTranslation();
  const { getActivitiesByOmsGlobal } = useActivity();
  const tabs = [
    { value: 'details', label: t('Tabs.Details') },
    { value: 'more', label: t('Tabs.AllInfo') },
    { value: 'activities', label: t('Tabs.Activities') }
  ];
  const [statusOpened, setStatusOpened] = useState(null);

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const { id } = useParams();

  useEffect(() => {
    clearState();
    getOmsGlobal(id);
    
    getActivitiesByOmsGlobal(id);
    getStatuses();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (omsGlobal){
      generateToken();
      setComments(omsGlobal.comment);
    } 
    //eslint-disable-next-line
  }, [omsGlobal]);

  useEffect(() => {
    if (statuses) {
      statuses.map(st => {
        if (st.name === 'opened') {
          setStatusOpened(st._id);
        }
        return false;
      });
    }
    // eslint-disable-next-line
  }, [statuses]);

  useEffect(() => {
    if (statusOpened) {
      if (
        omsGlobal &&
        omsGlobal.status &&
        omsGlobal.status.name === 'new' &&
        omsGlobal.role === 'user'
      ) {
        updateOmsGlobal({ status: statusOpened }, id);
      }
    }
    // eslint-disable-next-line
  }, [statusOpened, omsGlobal]);

  return (
    <Page className={classes.root} title="Customer Details">
      <Container maxWidth={false}>
        <Header customer={omsGlobal} />
        <Box mt={3}>
          <Tabs
            onChange={handleTabsChange}
            scrollButtons="auto"
            value={currentTab}
            variant="scrollable"
            textColor="secondary"
          >
            {tabs.map(tab => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>
        <Divider />
        <Box mt={3}>
          {currentTab === 'details' && <Details customer={omsGlobal} />}
          {currentTab === 'activities' && <Activities />}
          {currentTab === 'more' && <AllInfo customer={omsGlobal} />}
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerDetailsView;
