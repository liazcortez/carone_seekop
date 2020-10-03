import React, { useReducer } from 'react';
import LeadContext from './leadContext';
import LeadReducer from './leadReducer';
import api from '../../api/api';
import { 
  GET_LEADS, 
  GET_LEAD, 
  UPDATE_LEAD, 
  GET_LAST_LEADS,
  DELETE_LEAD, 
  CREATE_LEAD, 
  SET_ERROR, 
  GET_LEADS_CHART, 
  GET_LEADS_BY_STATUS,
  CLEAR_STATE, 
  SET_LOADING,
  GET_LEADS_BY_STORE,
  GET_LEADS_NEW,
  GET_LEADS_SOLD,
  GET_LEADS_FOLLOW,
  GET_LEADS_DATE,
  GET_ALL_CHART_LEADS,
  GET_LEADS_BY_USER,
  GET_ANALYTICS,
  GET_ANALYTICS_METRICS,
  CLEAR_METRICS

} from '../types';

const LeadState = props => {
  const initialState = {
    leads: [],
    lead: {},
    loading: false,
    error: null,
    newS: null,
    sold: null,
    date: null,
    follow: null,
    analytics: [],
    lastLeads: [],
    labels: null,
    metrics: null
  };

  const [state, dispatch] = useReducer(LeadReducer, initialState);

  const getAnalytics = async(startDate,endDate, account)=>{
    setLoading();
    try {
      let finalArray = [];
      let labels = [];
      let res;
      for(let i = 0; i < account.length; i++){
        res = await api.get(
          `http://api.supermetrics.com/enterprise/v2/query/data/json?json={"ds_id":"FA","ds_accounts":["${account[i].account}"],"start_date":"${startDate}","end_date":"${endDate}","fields":[{"id":"onsite_conversion.lead_grouped"},{"id":"cost"},{"id":"cost_per_on_facebook_lead"}],"max_rows":1000,"api_key":"api_Difwcw7Y5EXIa0y8V8RB11Mq_iR9WqTmEHXkWHFfGcA9lg2NJxJkG2xlMvZ7kiTlsCQ_hzuZeiWYR1bMHnkH9GzZO0ApOajysYt2"}`);
          finalArray.push(res.data.data[1][0]);
          labels.push(account[i].name);
      } 
     
      dispatch({ type: GET_ANALYTICS, payload: finalArray, cuenta: labels });

          
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response})

    }
  }

  const getAnalyticsMetrics = async(startDate,endDate, account)=>{
    clearMetrics();
    setLoading();
    try {
      const res = await api.get(
        `http://api.supermetrics.com/enterprise/v2/query/data/json?json={"ds_id":"FA","ds_accounts":[${account}],"start_date":"${startDate}","end_date":"${endDate}","fields":[{"id":"onsite_conversion.lead_grouped"},{"id":"cost"},{"id":"cost_per_on_facebook_lead"}],"max_rows":1000,"api_key":"api_Difwcw7Y5EXIa0y8V8RB11Mq_iR9WqTmEHXkWHFfGcA9lg2NJxJkG2xlMvZ7kiTlsCQ_hzuZeiWYR1bMHnkH9GzZO0ApOajysYt2"}`);

      dispatch({ type: GET_ANALYTICS_METRICS, payload: res.data.data[1]});
          
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response})

    }
  }

  //Get Leads
  const getLeads = async () => {
    clearState();
    setLoading();
    try {
      const res = await api.get(`/leads`);
      dispatch({ type: GET_LEADS, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Get Leads
  const getLeadsByStore = async (storeId, status) => {
    clearState();
    setLoading();
    try {
      let res;
      if(status !== ''){
        res = await api.get(`/stores/${storeId}/leads?status=${status}`);

      }else{
        res = await api.get(`/stores/${storeId}/leads`);

      }

      dispatch({ type: GET_LEADS_BY_STORE, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Get Leads by User
  const getLeadsByUser = async (userId, status) => {
    clearState();
    setLoading();
    try {
      let res;
      if(status !== ''){
        res = await api.get(`/users/${userId}/leads?status=${status}`);

      }else{
        res = await api.get(`/users/${userId}/leads`);

      }

      dispatch({ type: GET_LEADS_BY_USER, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Get Single Item by ID
  const getLead = async leadId => {
    clearState();
    setLoading();
    try {
      const res = await api.get(`/leads/${leadId}`);
      dispatch({
        type: GET_LEAD,
        payload: res.data.data
      });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Update Lead
  const updateLeadStatus = async (lead) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    setLoading();
    try{
      const res = await api.put(`/leads/${lead.id}`,{ status: lead.status }, config);
      dispatch({ type: UPDATE_LEAD, payload: res.data.data }); 
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})
    }
  };

  
  //Update Lead
  const updateLead = async (lead, leadId) => {
    const config =  {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    setLoading();
    try {    
      const res = await api.put(`/leads/${leadId}`, {...lead} ,config);
      dispatch({ type: UPDATE_LEAD, payload: res.data.data })
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})
    }
  };

  //Delete Lead
  const deleteLead = async (leadId) => {
    const config =  {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    clearState();
    setLoading();
    try {   
      const res = await api.delete(`/leads/${leadId}`, config);
      dispatch({ type: DELETE_LEAD, payload: res.data.data })
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Create Lead
  const createLead = async (lead) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    clearState();
    setLoading();
    try {
      const res = await api.post(`/leads`, { ...lead }, config);
      dispatch({ type: CREATE_LEAD, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  }

  //Get leads chart
  const getLeadsChart = async (search) => {
    const config = {
      header:{
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    setLoading();
    try {
      const res = await api.get(`/leads${search}`, config);
      dispatch({ type: GET_LEADS_CHART, payload: res.data.data});
    }catch(err){
      dispatch({ type: SET_ERROR, payload: err.response.data});
    }
  };

  //Get leads by status
  const getLeadsByStatus = async (status) => {
    const config = {
      header:{
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    clearState();
    setLoading();
    try {
      const res = await api.get(`/leads?status=${status}`, config);
      dispatch({ type: GET_LEADS_BY_STATUS, payload: res.data.data});
    }catch(err){
      dispatch({ type: SET_ERROR, payload: err.response.data});
    }
  };

  //Get leads with advanced results
  const getLeadsAR = async (query, type) => {
    const config = {
      header:{
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    setLoading();


    if(type  === 'date'){
      try {
        const res = await api.get(`/leads${query}`, config);

        dispatch({ type: GET_LEADS_DATE, payload: res.data});
      }catch(err){
        dispatch({ type: SET_ERROR, payload: err.response.data});
      }
    }
    if(type === 'new'){
      try {
        const res = await api.get(`/leads${query}`, config);
        dispatch({ type: GET_LEADS_NEW, payload: res.data});
      }catch(err){
        dispatch({ type: SET_ERROR, payload: err.response.data});
      }
    }
    if(type === 'sold'){
      try {

        const res = await api.get(`/leads${query}`, config);
        dispatch({ type: GET_LEADS_SOLD, payload: res.data});
      }catch(err){
        dispatch({ type: SET_ERROR, payload: err.response.data});
      }
    }
    if(type === 'followup'){
      try {

        const res = await api.get(`/leads${query}`, config);
        dispatch({ type: GET_LEADS_FOLLOW, payload: res.data});
      }catch(err){
        dispatch({ type: SET_ERROR, payload: err.response.data});
      }
    }
    if(type === 'latest'){
      try {
        const res = await api.get(`/leads?limit=5${query}`, config);
        dispatch({ type: GET_LAST_LEADS, payload: res.data.data});
      }catch(err){
        dispatch({ type: SET_ERROR, payload: err.response.data});
      }
    }
    if(type === 'all'){
      
      try {
        const res = await api.get(`/leads/chart?${query}`, config);
        dispatch({ type: GET_ALL_CHART_LEADS, payload: res.data.data});

      }catch(err){
        dispatch({ type: SET_ERROR, payload: err.response.data});
      }
    }
    if(type === 'all2'){
      
      try {
        const res = await api.get(`/leads/chart?${query}&type=0`, config);
        dispatch({ type: GET_ALL_CHART_LEADS, payload: res.data.data});

      }catch(err){
        dispatch({ type: SET_ERROR, payload: err.response.data});
      }
    }
    if(type === 'models'){
      try {
        const res = await api.get(`/leads/chartByModel?${query}`, config);
        dispatch({ type: GET_ALL_CHART_LEADS, payload: res.data.data});
      }catch(err){
        dispatch({ type: SET_ERROR, payload: err.response.data});
      }
    }
  };

  //Clear State
  const clearState = () => dispatch({ type: CLEAR_STATE });
  const clearMetrics = () => dispatch({ type: CLEAR_METRICS });

  //Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <LeadContext.Provider
      value={{
        loading: state.loading,
        leads: state.leads,
        lead: state.lead,
        error: state.error,
        newS: state.newS,
        sold: state.sold,
        follow: state.follow,
        date: state.date,
        lastLeads: state.lastLeads,
        getLeads,
        getLead,
        updateLeadStatus,
        updateLead,
        deleteLead,
        createLead,
        getLeadsChart,
        getLeadsByStatus,
        clearState,
        setLoading,
        getLeadsByStore,
        getLeadsAR,
        getLeadsByUser,
        getAnalytics,
        analytics: state.analytics,
        labels: state.labels,
        getAnalyticsMetrics,
        metrics: state.metrics,
        clearMetrics
      }}
    >
      {props.children}
    </LeadContext.Provider>
  );
};

export default LeadState;
