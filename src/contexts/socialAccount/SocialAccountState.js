import React, { useReducer } from 'react';
import SocialAccountContext from './socialAccountContext';
import SocialAccountReducer from './socialAccountReducer';
import api from '../../api/api';
import { 
  GET_SOCIAL_ACCOUNTS, 
  CREATE_SOCIAL_ACCOUNT, 
  GET_SOCIAL_ACCOUNT, 
  DELETE_SOCIAL_ACCOUNT, 
  UPDATE_SOCIAL_ACCOUNT, 
  SET_ERROR,
  CLEAR_STATE,
  SET_LOADING
 } from '../types';

const SocialAccountState = props => {
  const initialState = {
    socialAccounts: [],
    socialAccount: {},
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(SocialAccountReducer, initialState);

  //Get SocialAccounts
  const getSocialAccounts = async () => {
    clearState();
    setLoading();
    try {
      const res = await api.get(`/socialAccounts`);
      dispatch({ type: GET_SOCIAL_ACCOUNTS, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

   //Get SocialAccount
   const getSocialAccount = async (socialAccountId) => {
    clearState();
    setLoading();
    try {
      const res = await api.get(`/socialAccounts/${socialAccountId}`);
      dispatch({ type: GET_SOCIAL_ACCOUNT, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})
    }
  };

  //Create SocialAccount
  const createSocialAccount = async (socialAccount) => {

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    clearState();
    setLoading();
    try {
      const res = await api.post(`/socialAccounts`, { ...socialAccount }, config);
      dispatch({ type: CREATE_SOCIAL_ACCOUNT, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  }

   //Delete SocialAccount
   const deleteSocialAccount = async (socialAccountId) => {
    const config =  {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    clearState();
    setLoading();
    try {
      
      const res = await api.delete(`/socialAccounts/${socialAccountId}`, config);
      dispatch({ type: DELETE_SOCIAL_ACCOUNT, payload: res.data.data })
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Update SocialAccount
  const updateSocialAccount = async (socialAccount, socialAccountId) => {
    const config =  {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    clearState();
    setLoading();
    try {
      const res = await api.put(`/socialAccounts/${socialAccountId}`, {...socialAccount} ,config);
      dispatch({ type: UPDATE_SOCIAL_ACCOUNT, payload: res.data.data })
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Clear State
  const clearState = () => dispatch({ type: CLEAR_STATE });

  //Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <SocialAccountContext.Provider
      value={{
        loading: state.loading,
        socialAccounts: state.socialAccounts,
        socialAccount: state.socialAccount,
        error: state.error,
        getSocialAccounts,
        getSocialAccount,
        createSocialAccount,
        deleteSocialAccount,
        updateSocialAccount,
        clearState,
        setLoading
      }}
    >
      {props.children}
    </SocialAccountContext.Provider>
  );
};

export default SocialAccountState;
