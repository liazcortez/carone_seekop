import React, { useReducer } from 'react';
import ConversationsContext from './conversationsContext';
import ConversationsReducer from './conversationsReducer';
import api from '../../api/api';

import {
  SET_LOADING,
  CLEAR_STATE,
  CLEAR_ERROR
} from '../types';

const ConversationsState = props => {
  const initialState = {
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(ConversationsReducer, initialState);

  const sendTemplate = async (from, customer, template, agent, phone, id) => {
    setLoading();
    if(!phone || phone === ''){
      phone = 0;
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };

    await api.post(`/conversation/sendTemplate`, {from, customer, agent, template, phone, id} ,config);
  }; 

  const setLoading = () => dispatch({ type: SET_LOADING });
  const setError = () => dispatch({ type: CLEAR_ERROR });
  const clearState = () => dispatch({ type: CLEAR_STATE });

  return (
    <ConversationsContext.Provider
      value={{
        setError,
        clearState,
        sendTemplate,
        loading: state.loading,
        error: state.error
      }}
    >
      {props.children}
    </ConversationsContext.Provider>
  );
};

export default ConversationsState;
