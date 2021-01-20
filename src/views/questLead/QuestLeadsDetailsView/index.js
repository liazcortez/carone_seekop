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
import useQuestLead from 'src/hooks/useQuestLead';
import useActivity from 'src/hooks/useActivity';
import { useParams } from 'react-router';
import useStatus from 'src/hooks/useStatus';
import { useTranslation } from 'react-i18next';

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
  const { questLead, getQuestLead, updateQuestLead, generateToken } = useQuestLead();
  const { statuses, getStatuses } = useStatus();
  const { t } = useTranslation();
  const { getActivitiesByQuestLead } = useActivity();
  const tabs = [
    { value: 'details', label: t('Tabs.Details') },
    { value: 'activities', label: t('Tabs.Activities') }
  ];
  const [statusOpened, setStatusOpened] = useState(null);

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const { id } = useParams();

  useEffect(() => {
    getQuestLead(id);
    getActivitiesByQuestLead(id);
    getStatuses();
    // eslint-disable-next-line
  }, []);

  useEffect(()=>{
    if(questLead)
    generateToken();
    //eslint-disable-next-line
  },[questLead])

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
        questLead &&
        questLead.status &&
        questLead.status.name === 'new' &&
        questLead.role === 'user'
      ) {
        updateQuestLead({ status: statusOpened }, id);
      }
    }
    // eslint-disable-next-line
  }, [statusOpened, questLead]);

  return (
    <Page className={classes.root} title="Customer Details">
      <Container maxWidth={false}>
        <Header customer={questLead} />
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
          {currentTab === 'details' && <Details customer={questLead} />}
          {currentTab === 'activities' && <Activities />}
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerDetailsView;
