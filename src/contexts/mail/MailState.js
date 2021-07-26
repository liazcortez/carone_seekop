import React, { useReducer } from 'react';
import MailContext from './mailContext'
import MailReducer from './mailReducer'
import api from '../../api/api';
import { 
  CREATE_MAIL, 
  CREATE_MAIL_ATTACHMENT, 
  SET_ERROR,
  CLEAR_STATE,
  SET_LOADING,
  GET_SEGMENTATIONS
} from '../types';

const MailState = props => {
  const initialState = {
    mails: [],
    mail: {},
    loading: false,
    error: null,
    segmentations:[]

  };

  const [state, dispatch] = useReducer(MailReducer, initialState);

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
  
  //get mailjet segmentations
  const getSegmentations = async () => {
    console.log('getsegmentations');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    setLoading();
    try {
      console.log('getting segmentations');
      const res = await api.get(`/mails/segmentation`, config);
      console.log('segmentations',res.data.data.Data);
      dispatch({ type: GET_SEGMENTATIONS, payload: res.data.data.Data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err})
    }
  }

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
        segmentations: state.segmentations,
        createMail,
        clearState,
        setLoading,
        createMailAttachment,
        getSegmentations
      }}
    >
      {props.children}
    </MailContext.Provider>
  );
};

export default MailState;
