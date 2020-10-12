import React, { useReducer } from 'react';
import SettingContext from './settingContext';
import SettingReducer from './settingReducer';
import api from '../../api/api';
import { 
  GET_SETTINGS, 
  GET_SETTINGS_BY_STORE, 
  CREATE_SETTING, 
  GET_SETTING, 
  DELETE_SETTING, 
  UPDATE_SETTING, 
  SET_ERROR,
  CLEAR_STATE,
  SET_LOADING
 } from '../types';

const SettingState = props => {
  const initialState = {
    settings: [],
    setting: {},
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(SettingReducer, initialState);

  //Get Settings
  const getSettings = async () => {
    setLoading();
    try {
      const res = await api.get(`/settings`);
      dispatch({ type: GET_SETTINGS, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

   //Get Setting
   const getSetting = async (settingId) => {
    clearState();
    setLoading();
    try {
      const res = await api.get(`/settings/${settingId}`);
      dispatch({ type: GET_SETTING, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})
    }
  };

  //Get Setting
  const getSettingsByStore = async (storeId) => {
    clearState();
    setLoading();
    try {
      console.log(storeId)
      const res = await api.get(`/stores/${storeId}/settings`);
      dispatch({ type: GET_SETTINGS_BY_STORE, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})
    }
  };

  //Create Setting
  const createSetting = async (setting) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    setLoading();
    try {
      const res = await api.post(`/settings`, { ...setting}, config);
      dispatch({ type: CREATE_SETTING, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  }

   //Delete Setting
   const deleteSetting = async (settingId) => {
    const config =  {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    clearState();
    setLoading();
    try {
      
      const res = await api.delete(`/settings/${settingId}`, config);
      dispatch({ type: DELETE_SETTING, payload: res.data.data })
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Update Setting
  const updateSetting = async (setting, settingId) => {

    const config =  {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    setLoading();
    try {
    
      const res = await api.put(`/settings/${settingId}`, { ...setting, }, config);
      dispatch({ type: UPDATE_SETTING, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Clear State
  const clearState = () => dispatch({ type: CLEAR_STATE });

  //Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <SettingContext.Provider
      value={{
        loading: state.loading,
        settings: state.settings,
        setting: state.setting,
        error: state.error,
        getSettings,
        getSetting,
        createSetting,
        deleteSetting,
        updateSetting,
        getSettingsByStore,
        clearState,
        setLoading
      }}
    >
      {props.children}
    </SettingContext.Provider>
  );
};

export default SettingState;
