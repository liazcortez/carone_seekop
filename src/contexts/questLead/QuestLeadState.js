import React, { useReducer } from 'react';
import QuestLeadContext from './questLeadContext';
import QuestLeadReducer from './questLeadReducer';
import api from '../../api/api';
import {
  GET_QUESTLEADS,
  GET_QUESTLEAD,
  UPDATE_QUESTLEAD,
  DELETE_QUESTLEAD,
  CREATE_QUESTLEAD,
  SET_ERROR,
  GET_QUESTLEADS_CHART,
  CLEAR_STATE,
  SET_LOADING,
  GET_QUESTLEADS_BY_STORE,
  GET_ALL_CHART_QUESTLEADS,
  GET_QUESTLEADS_BY_USER,
  SET_VALUE,
  CALL_USER
} from '../types';

const QuestLeadState = props => {
  const initialState = {
    questLeads: [],
    questLead: {},
    loading: false,
    error: null,
    newS: null,
    sold: null,
    date: null,
    follow: null,
    analytics: [],
    lastQuestLeads: [],
    labels: null,
    value: [],
    count: null,
    callToken: null,
    chart: []
  };

  const [state, dispatch] = useReducer(QuestLeadReducer, initialState);

  const AdvancedResults = async (pagination, values) => {
    clearState();
    setLoading();
    try {

      let query = "";
      let keys = [];
      for (var k in values) keys.push(k);
      keys.map(key => {
        if(values[key] !== ''){
          if(key !== 'make' && key !== 'store'&& key !== 'vehicle' && key !=='source' && key !== 'status') {return query += `&${key}=${values[key]}`}
          else { if(values[key].split("/")[0] !== '0' && values[key] !== '' ) return query += `&${key}=${values[key].split('/')[0]}`}
        }
        return false;

      })
      
      const res = await api.get(
        `/questLeads?page=${pagination.page}&limit=${pagination.limit}${query}&searchType=and`
      );

      dispatch({
        type: GET_QUESTLEADS,
        payload: res.data.data,
        count: res.data.pagination.total

      });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };


  //Get QuestLeads
  const getQuestLeads = async (pagination, tabs, query, typeQuery) => {
    setLoading();
    try {
      let res;
      if(!query) query = '';

      if (pagination) {
        if(tabs.includes('status')){
          let stat = tabs.split('.');
          res = await api.get(
            `/questLeads?page=${pagination.page}&limit=${pagination.limit}&status=${stat[1]}&searchIndex=name-sellerKey-seller-sellerEmail-email-make-source-vehicle-store&searchText=${query}&searchType=${typeQuery}`
          );
        }else{
          res = await api.get(
            `/questLeads?page=${pagination.page}&limit=${pagination.limit}&searchIndex=name-sellerKey-seller-sellerEmail-email-make-source-vehicle-store&searchText=${query}&searchType=${typeQuery}`
          );
        }

      } 
      dispatch({
        type: GET_QUESTLEADS,
        payload: res.data.data,
        count: res.data.pagination.total
      });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Get QuestLeads
  const startCron = async status => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    try {
      await api.post(`/questLeads/status`, { start: status }, config);
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Get QuestLeads
  const getQuestLeadsByStore = async (storeId, pagination, tabs, query, typeQuery) => {
    setLoading();
    try {
      let res;
      if(!query) query = '';

      if (pagination) {

        if(tabs.includes('temperature')){

          let temp = tabs.split('.');
          res = await api.get(`/questLeads?page=${pagination.page}&limit=${pagination.limit}&rating=${temp[1]}&searchIndex=name-sellerKey-seller-sellerEmail-email-make-source-vehicle-store&searchText=${query}&store=${storeId}&searchType=${typeQuery}`);

        }else if(tabs.includes('status')){

          let status = tabs.split('.');
          res = await api.get(`/questLeads?page=${pagination.page}&limit=${pagination.limit}&status=${status[1]}&searchIndex=name-sellerKey-seller-sellerEmail-email-make-source-vehicle-store&searchText=${query}&store=${storeId}&searchType=${typeQuery}`);

        }else{
          res = await api.get(`/questLeads?page=${pagination.page}&limit=${pagination.limit}&searchIndex=name-sellerKey-seller-sellerEmail-email-make-source-vehicle-store&searchText=${query}&store=${storeId}&searchType=${typeQuery}`)
        }

      }else{
        res = await api.get(`/stores/${storeId}/questLeads`);
      }

      dispatch({ 
        type: GET_QUESTLEADS_BY_STORE, 
        payload: res.data.data,
        count: res.data.pagination.total
       });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Get QuestLeads by User
  const getQuestLeadsByUser = async (userId, pagination, tabs, query, typeQuery) => {
    setLoading();
    try {
      let res;
      if(!query) query = '';

      if (pagination) {

        if(tabs.includes('temperature')){

          let temp = tabs.split('.');
          res = await api.get(`/questLeads?page=${pagination.page}&limit=${pagination.limit}&rating=${temp[1]}&searchIndex=name-sellerKey-seller-sellerEmail-email-make-source-vehicle-store&searchText=${query}&agent=${userId}&searchType=${typeQuery}`);

        }else if(tabs.includes('status')){

          let status = tabs.split('.');
          res = await api.get(`/questLeads?page=${pagination.page}&limit=${pagination.limit}&status=${status[1]}&searchIndex=name-sellerKey-seller-sellerEmail-email-make-source-vehicle-store&searchText=${query}&agent=${userId}&searchType=${typeQuery}`);

        }else{
          res = await api.get(`/questLeads?page=${pagination.page}&limit=${pagination.limit}&searchIndex=name-sellerKey-seller-sellerEmail-email-make-source-vehicle-store&searchText=${query}&agent=${userId}&searchType=${typeQuery}`)
        }

      }

      dispatch({ 
        type: GET_QUESTLEADS_BY_USER, 
        payload: res.data.data,
        count: res.data.pagination.total
       });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Get Single Item by ID
  const getQuestLead = async questLeadId => {
    clearState();
    setLoading();
    try {
      const res = await api.get(`/questLeads/${questLeadId}`);
      dispatch({
        type: GET_QUESTLEAD,
        payload: res.data.data
      });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Update QuestLead
  const updateQuestLeadStatus = async questLead => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    setLoading();
    try {
      const res = await api.put(
        `/questLeads/${questLead.id}`,
        { status: questLead.status },
        config
      );
      dispatch({ type: UPDATE_QUESTLEAD, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Update QuestLead
  const updateQuestLead = async (questLead, questLeadId) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    setLoading();
    try {
      const res = await api.put(`/questLeads/${questLeadId}`, { ...questLead }, config);
      dispatch({ type: UPDATE_QUESTLEAD, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Delete QuestLead
  const deleteQuestLead = async questLeadId => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    setLoading();
    try {
      const res = await api.delete(`/questLeads/${questLeadId}`, config);
      dispatch({ type: DELETE_QUESTLEAD, payload: res.data.deletedId });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Create QuestLead
  const createQuestLead = async questLead => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    clearState();
    setLoading();
    try {
      const res = await api.post(`/questLeads/createFromDealer`, { ...questLead }, config);
      console.log(res)
      dispatch({ type: CREATE_QUESTLEAD, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  const sendWsp = async msg => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    setLoading();
    try {
      await api.post(`/questLeads/whatsapp`, { ...msg }, config);
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Get questLeads chart
  const getQuestLeadsChart = async search => {
    const config = {
      header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    setLoading();
    try {
      const res = await api.get(`/questLeads${search}`, config);
      dispatch({ type: GET_QUESTLEADS_CHART, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  const GetVsQuestLeads = async query => {
    clearState();
    setLoading();
    const config = {
      header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    try {
      const res = await api.get(`/questLeads/chartVs?${query}`, config);
      dispatch({ type: SET_VALUE, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Get questLeads with advanced results
  const getQuestLeadsAR = async (query) => {
    const config = {
      header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    clearState();
    setLoading();
    try {
      const res = await api.get(`/questLeads/chartInfo?${query}`, config);
      dispatch({ type: GET_ALL_CHART_QUESTLEADS, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
   
  };

  const generateToken = async page => {
    const config = {
      header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    try{
      const res = await api.post('/calls/generate', { page }, config);
      localStorage.setItem('callToken', res.data.token);
      dispatch({ type: CALL_USER, payload: res.data.token })
    }catch(err){
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  const makeCall = async phoneNumber => {
    const config = {
      header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    await api.post('/calls/connect', phoneNumber, config);
  };

  //Clear State
  const clearState = () => dispatch({ type: CLEAR_STATE });

  //Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <QuestLeadContext.Provider
      value={{
        loading: state.loading,
        questLeads: state.questLeads,
        questLead: state.questLead,
        error: state.error,
        newS: state.newS,
        sold: state.sold,
        follow: state.follow,
        date: state.date,
        lastQuestLeads: state.lastQuestLeads,
        getQuestLeads,
        getQuestLead,
        updateQuestLeadStatus,
        updateQuestLead,
        deleteQuestLead,
        createQuestLead,
        getQuestLeadsChart,
        clearState,
        setLoading,
        getQuestLeadsByStore,
        getQuestLeadsAR,
        getQuestLeadsByUser,
        makeCall,
        analytics: state.analytics,
        labels: state.labels,
        GetVsQuestLeads,
        value: state.value,
        startCron,
        generateToken,
        sendWsp,
        count: state.count,
        chart: state.chart,
        callToken: state.callToken,
        AdvancedResults
      }}
    >
      {props.children}
    </QuestLeadContext.Provider>
  );
};

export default QuestLeadState;
