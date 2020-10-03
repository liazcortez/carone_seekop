import React, { useReducer } from 'react';
import MailMarketingContext from './mailMarketingContext'
import MailMarketingReducer from './mailMarketingReducer'
import api from '../../api/api';
import { 
  CREATE_LIST,
  SET_ERROR,
  SET_LOADING,
  CLEAR_STATE,
  GET_LISTS,
  GET_LIST,
  UPDATE_LIST,
  DELETE_LIST,
  CREATE_CONTACT,
  GET_CONTACTS_BY_LIST
} from '../types';

const MailMarketingState = props => {
  const initialState = {
    list: {},
    lists: [],
    contact: {},
    contacts: [],
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(MailMarketingReducer, initialState);

  const createList = async (list) =>{
    setLoading();
    try{
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      };
      const res = await api.post('/mailMarketing',{...list} ,config);
      dispatch({type: CREATE_LIST, payload: res.data.data.Data[0]})
    }catch(err){
      dispatch({ type: SET_ERROR, payload: err.response})
    }
  }

  const getLists = async () =>{
    setLoading();
    try{
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      };
      const res = await api.get('/mailMarketing', config);
      dispatch({type: GET_LISTS, payload: res.data.data.Data})
    }catch(err){
      dispatch({ type: SET_ERROR, payload: err.response})
    }
  }

  const updateList = async (list, listId) =>{
    setLoading();
    try{
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      };
      const res = await api.put(`/mailMarketing/${listId}`, {...list} ,config);
      dispatch({type: UPDATE_LIST, payload: res.data.data.Data[0]})
    }catch(err){
      dispatch({ type: SET_ERROR, payload: err.response})
    }
  }

  const getList = async (listId) =>{
    setLoading();
    try{
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      };
      const res = await api.get(`/mailMarketing/${listId}`, config);
      dispatch({type: GET_LIST, payload: res.data.data.Data[0]})
    }catch(err){
      dispatch({ type: SET_ERROR, payload: err.response})
    }
  }

  const deleteList = async (listId) =>{
    setLoading();
    try{
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      };
      const res = await api.delete(`/mailMarketing/${listId}`, config);
      dispatch({type: DELETE_LIST, payload: res.data.data.Data[0]})
    }catch(err){
      dispatch({ type: SET_ERROR, payload: err.response})
    }
  }

  const createContact = async (contact) =>{
    setLoading();
    try{
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      };
      const res = await api.post(`/mailMarketing/contact`, {...contact} ,config);
      dispatch({type: CREATE_CONTACT, payload: res.data.data.Data[0]})
    }catch(err){
      dispatch({ type: SET_ERROR, payload: err.response})
    }
  }

  const getContactsByList = async (listId) =>{
    setLoading();
    try{
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      };
      const res = await api.get(`/mailMarketing/contactList/${listId}`,config);
      dispatch({type: GET_CONTACTS_BY_LIST, payload: res.data.data.Data})
    }catch(err){
      dispatch({ type: SET_ERROR, payload: err.response})
    }
  }

  //Clear State
  const clearState = () => dispatch({ type: CLEAR_STATE });

  //Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <MailMarketingContext.Provider
      value={{
        clearState,
        setLoading,
        createList,
        getLists,
        getList,
        updateList,
        list: state.list,
        lists: state.lists,
        loading: state.loading,
        error: state.error,
        deleteList,
        createContact,
        contacts: state.contacts,
        contact: state.contact,
        getContactsByList
      }}
    >
      {props.children}
    </MailMarketingContext.Provider>
  );
};

export default MailMarketingState;
