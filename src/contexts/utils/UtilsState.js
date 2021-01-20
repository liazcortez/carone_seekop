import React, { useReducer } from 'react';
import UtilsContext from './utilsContext';
import UtilsReducer from './utilsReducer';
import api from '../../api/api';

import {
  SET_ERROR,
  CALL_USER,
  SET_LOADING,
  LOAD_CSV,
} from '../types';

const StoreState = props => {
  const initialState = {
    loading: false,
    callToken: null,
    error: null
  };

  const [state, dispatch] = useReducer(UtilsReducer, initialState);

  const uploadCsv = async (data) => {
    setLoading();
    try {
      await api.post(
        `/utils/uploadCsv`,
        data
      );
      dispatch({ type: LOAD_CSV });

    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  }

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

  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <UtilsContext.Provider
      value={{
        uploadCsv,
        generateToken,
        callToken: state.callToken,
        loading: state.loading
      }}
    >
      {props.children}
    </UtilsContext.Provider>
  );
};

export default StoreState;
