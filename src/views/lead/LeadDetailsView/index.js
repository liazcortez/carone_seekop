import React, {  useState, useEffect } from 'react';
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
import Invoices from './Invoices';
import Logs from './Logs';
import useLead from 'src/hooks/useLead';
import useActivity from 'src/hooks/useActivity';
import { useParams } from 'react-router';
import useStatus from 'src/hooks/useStatus';
import useAuth from 'src/hooks/useAuth'

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
  const { lead, getLead, updateLead } = useLead();
  const { statuses, getStatuses } = useStatus(); 
  const { user } = useAuth(); 
  const { getActivitiesByLead } = useActivity();
  const tabs = [
    { value: 'details', label: 'Details' },
    { value: 'email', label: 'Email' },
    { value: 'activities', label: 'Activities' }
  ];
  const [statusOpened, setStatusOpened] = useState(null);

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const { id } = useParams();
  useEffect(() => {
    getLead(id);
    getActivitiesByLead(id)
    getStatuses();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(statuses){
      statuses.map( st =>{
        if(st.name === 'opened'){
          setStatusOpened(st._id)
        }
        return false;
      })
    }
    // eslint-disable-next-line
  }, [statuses]);

  useEffect(() => {
    if(statusOpened){
      if(lead && lead.status && (lead.status.name === 'new') && (user.role === 'user')){
      updateLead({status: statusOpened}, id)
    }
    }
    // eslint-disable-next-line
  }, [statusOpened, lead]);

  // if (!customer) {
  //   return null;
  // }


  return (
    <Page className={classes.root} title="Customer Details">
      <Container maxWidth={false}>
        <Header customer={lead} />
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
          {currentTab === 'details' && <Details customer={lead} />}
          {currentTab === 'email' && <Invoices />}
          {currentTab === 'logs' && <Logs />}
          {currentTab === 'activities' && <Activities />}
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerDetailsView;
