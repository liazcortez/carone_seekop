import React, { useReducer } from 'react';
import MailContext from './mailContext'
import MailReducer from './mailReducer'
import api from '../../api/api';
import { 
  GET_MAILS, 
  CREATE_MAIL, 
  GET_MAIL, 
  DELETE_MAIL, 
  UPDATE_MAIL, 
  SET_ERROR,
  CLEAR_STATE,
  SET_LOADING,
  CREATE_MAIL_ATTACHMENT,
  GET_MAILS_BY_LEAD
} from '../types';

const MailState = props => {
  const initialState = {
    mails: [],
    mail: {},
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(MailReducer, initialState);

  //Get Mails
  const getMails = async () => {
    clearState();
    setLoading();
    try {
      const res = await api.get(`/mails`);
      dispatch({ type: GET_MAILS, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})
    }
  };

  //Get Mails
  const getMailsByLead = async (leadId) => {
    clearState();
    setLoading();
    try {
      const res = await api.get(`/leads/${leadId}/mails`);
      dispatch({ type: GET_MAILS_BY_LEAD, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})
    }
  };

   //Get Mail
   const getMail = async (mailId) => {
    clearState();
    setLoading();
    try {
      const res = await api.get(`/mails/${mailId}`);
      dispatch({ type: GET_MAIL, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Delete Mail
  const deleteMail = async (mailId) => {
    const config =  {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    clearState();
    setLoading();
    try {
      
      const res = await api.delete(`/mails/${mailId}`, config);
      dispatch({ type: DELETE_MAIL, payload: res.data.data })
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Create Mail attachment
  const createMailAttachment = async (mail, attachment) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    setLoading();
    try {
      const res = await api.post(`/mails`, { ...mail, attachments: attachment }, config);
      dispatch({ type: CREATE_MAIL_ATTACHMENT, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})
    }
  }

  //Create Mail
  const createMail = async (mail) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    setLoading();
    try {
      const res = await api.post(`/mails`, { ...mail }, config);
      dispatch({ type: CREATE_MAIL, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})
    }
  }

  //Update Mail
  const updateMail = async (mail, mailId) => {
    const config =  {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    clearState();
    setLoading();
    try {
      
      const res = await api.put(`/mails/${mailId}`, {...mail} ,config);
      dispatch({ type: UPDATE_MAIL, payload: res.data.data })
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})
    }
  };

  //Clear State
  const clearState = () => dispatch({ type: CLEAR_STATE });

  //Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <MailContext.Provider
      value={{
        loading: state.loading,
        mails: state.mails,
        mail: state.mail,
        error: state.error,
        getMails,
        createMail,
        getMail,
        deleteMail,
        updateMail,
        clearState,
        setLoading,
        getMailsByLead,
        createMailAttachment
      }}
    >
      {props.children}
    </MailContext.Provider>
  );
};

export default MailState;
