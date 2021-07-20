import React, { useReducer } from 'react';
import OmsGlobalContext from './omsGlobalContext';
import OmsGlobalReducer from './omsGlobalReducer';
import api from '../../api/api';
import {
  GET_OMSGLOBALS,
  GET_OMSGLOBAL,
  UPDATE_OMSGLOBAL,
  UPDATE_OMSGLOBAL_STATUS,
  DELETE_OMSGLOBAL,
  CREATE_OMSGLOBAL,
  SET_ERROR,
  GET_OMSGLOBALS_CHART,
  CLEAR_STATE,
  SET_LOADING,
  GET_OMSGLOBALS_BY_STORE,
  GET_ALL_CHART_OMSGLOBALS,
  GET_OMSGLOBALS_BY_USER,
  SET_VALUE,
  CALL_USER
} from '../types';

const OmsGlobalState = props => {
  const initialState = {
    omsGlobals: [],
    omsGlobal: {},
    loading: false,
    error: null,
    newS: null,
    sold: null,
    date: null,
    follow: null,
    analytics: [],
    lastOmsGlobals: [],
    labels: null,
    value: [],
    count: null,
    callToken: null,
    chart: []
  };

  const [state, dispatch] = useReducer(OmsGlobalReducer, initialState);

  const AdvancedResults = async (pagination, values) => {

    clearState();
    setLoading();
    try {

      let query = "";
      let keys = [];
      for (var k in values) keys.push(k);
      keys.map(key => {
        if(values[key] !== ''){
          if(key !== 'make' && key !== 'company' && key !== 'status' && key !== 'store') {return query += `&${key}=${values[key]}`}
          else { if(values[key].split("/")[0] !== '0' && values[key] !== '' ) return query += `&${key}=${values[key].split('/')[0]}`}
        }
        return false;

      })
      const res = await api.get(
        `/omsGlobals?page=${pagination.page}&limit=${pagination.limit}${query}&searchType=and&typeLead=oms`
      );
      dispatch({
        type: GET_OMSGLOBALS,
        payload: res.data.data,
        count: res.data.pagination.total

      });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Get OmsGlobals
  const getOmsGlobals = async (pagination, tabs, query, typeQuery) => {
    console.log(pagination, tabs, query, typeQuery)
    setLoading();
    try {
      let res;
      if(!query) query = '';

      if (pagination) {
        if(tabs.includes('status')){
          let stat = tabs.split('.');
          res = await api.get(
            `/omsGlobals?page=${pagination.page}&limit=${pagination.limit}&status=${stat[1]}&searchIndex=name-email-make-store-phone-phone2&searchText=${query}&searchType=${typeQuery}`
          );
        }else{
          res = await api.get(
            `/omsGlobals?page=${pagination.page}&limit=${pagination.limit}&searchIndex=name-email-make-store-phone-phone2&searchText=${query}&searchType=${typeQuery}`
          );
        }

      } else {
        res = await api.get(`/omsGlobals`);
      }
      dispatch({
        type: GET_OMSGLOBALS,
        payload: res.data.data,
        count: res.data.pagination.total
      });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
   
  };

  //Get OmsGlobals
  const startCron = async status => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    try {
      await api.post(`/omsGlobals/status`, { start: status }, config);
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Get OmsGlobals
  const getOmsGlobalsByStore = async (storeId, pagination, tabs, query, typeQuery) => {
    setLoading();
    try {
      let res;
      if(!query) query = '';

      if (pagination) {

        if(tabs.includes('temperature')){

          let temp = tabs.split('.');
          res = await api.get(`/omsGlobals?page=${pagination.page}&limit=${pagination.limit}&rating=${temp[1]}&searchIndex=name-email-make-store-phone-phone2&searchText=${query}&store=${storeId}&searchType=${typeQuery}`);

        }else if(tabs.includes('status')){

          let status = tabs.split('.');
          res = await api.get(`/omsGlobals?page=${pagination.page}&limit=${pagination.limit}&status=${status[1]}&searchIndex=name-email-make-store-phone-phone2&searchText=${query}&store=${storeId}&searchType=${typeQuery}`);

        }else{
          res = await api.get(`/omsGlobals?page=${pagination.page}&limit=${pagination.limit}&searchIndex=name-email-make-store-phone-phone2&searchText=${query}&store=${storeId}&searchType=${typeQuery}`)
        }

      }else{
        res = await api.get(`/stores/${storeId}/omsGlobals`);
      }

      dispatch({ 
        type: GET_OMSGLOBALS_BY_STORE, 
        payload: res.data.data,
        count: res.data.pagination.total
       });

    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Get OmsGlobals by User
  const getOmsGlobalsByUser = async (userId, pagination, tabs, query, typeQuery) => {
    setLoading();
    try {
      let res;
      if(!query) query = '';

      if (pagination) {

        if(tabs.includes('temperature')){

          let temp = tabs.split('.');
          res = await api.get(`/omsGlobals?page=${pagination.page}&limit=${pagination.limit}&rating=${temp[1]}&searchIndex=name-email-make-store-phone-phone2&searchText=${query}&agent=${userId}&searchType=${typeQuery}`);

        }else if(tabs.includes('status')){

          let status = tabs.split('.');
          res = await api.get(`/omsGlobals?page=${pagination.page}&limit=${pagination.limit}&status=${status[1]}&searchIndex=name-email-make-store-phone-phone2&searchText=${query}&agent=${userId}&searchType=${typeQuery}`);

        }else{
          res = await api.get(`/omsGlobals?page=${pagination.page}&limit=${pagination.limit}&searchIndex=name-email-make-store-phone-phone2&searchText=${query}&agent=${userId}&searchType=${typeQuery}`)
        }

      }else{
        res = await api.get(`/users/${userId}/omsGlobals`);
      }

      dispatch({ 
        type: GET_OMSGLOBALS_BY_USER, 
        payload: res.data.data,
        count: res.data.pagination.total
       });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Get Single Item by ID
  const getOmsGlobal = async omsGlobalId => {
    clearState();
    setLoading();
    console.log('getGlobal',omsGlobalId);
    try {
      const res = await api.get(`/omsGlobals/${omsGlobalId}`);
      console.log(res);
      dispatch({
        type: GET_OMSGLOBAL,
        payload: res.data.data
      });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Update OmsGlobal
  const updateOmsGlobalStatus = async omsGlobal => {
    console.log(omsGlobal);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    setLoading();
    try {
      const res = await api.put(
        `/omsGlobals/${omsGlobal.id}`,
        { status: omsGlobal.status },
        config
      );
      dispatch({ type: UPDATE_OMSGLOBAL_STATUS, payload: res.data.data.status });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Update OmsGlobal
  const updateOmsGlobal = async (omsGlobal, omsGlobalId) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    setLoading();
    try {
      const res = await api.put(`/omsGlobals/${omsGlobalId}`, { ...omsGlobal }, config);
      dispatch({ type: UPDATE_OMSGLOBAL, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Delete OmsGlobal
  const deleteOmsGlobal = async omsGlobalId => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    setLoading();
    try {
      const res = await api.delete(`/omsGlobals/${omsGlobalId}`, config);
      dispatch({ type: DELETE_OMSGLOBAL, payload: res.data.deletedId });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Create OmsGlobal
  const createOmsGlobal = async omsGlobal => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    clearState();
    setLoading();
    try {
      const res = await api.post(`/omsGlobals`, { ...omsGlobal }, config);
      dispatch({ type: CREATE_OMSGLOBAL, payload: res.data.data });
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
      await api.post(`/omsGlobals/whatsapp`, { ...msg }, config);
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Get omsGlobals chart
  const getOmsGlobalsChart = async search => {
    const config = {
      header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    setLoading();
    try {
      const res = await api.get(`/omsGlobals${search}`, config);
      dispatch({ type: GET_OMSGLOBALS_CHART, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  const GetVsOmsGlobals = async query => {
    clearState();
    setLoading();
    const config = {
      header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    try {
      const res = await api.get(`/omsGlobals/chartVs?${query}`, config);
      dispatch({ type: SET_VALUE, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Get omsGlobals with advanced results
  const getOmsGlobalsAR = async (query) => {
    const config = {
      header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    clearState();
    setLoading();
    try {
      const res = await api.get(`/omsGlobals/chartInfo?${query}`, config);
      dispatch({ type: GET_ALL_CHART_OMSGLOBALS, payload: res.data.data });
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
    <OmsGlobalContext.Provider
      value={{
        loading: state.loading,
        omsGlobals: state.omsGlobals,
        omsGlobal: state.omsGlobal,
        error: state.error,
        newS: state.newS,
        sold: state.sold,
        follow: state.follow,
        date: state.date,
        lastOmsGlobals: state.lastOmsGlobals,
        getOmsGlobals,
        getOmsGlobal,
        updateOmsGlobalStatus,
        updateOmsGlobal,
        deleteOmsGlobal,
        createOmsGlobal,
        getOmsGlobalsChart,
        clearState,
        setLoading,
        getOmsGlobalsByStore,
        getOmsGlobalsAR,
        getOmsGlobalsByUser,
        makeCall,
        analytics: state.analytics,
        labels: state.labels,
        GetVsOmsGlobals,
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
    </OmsGlobalContext.Provider>
  );
};

export default OmsGlobalState;
