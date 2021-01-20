import React, { useReducer } from 'react';
import StoreContext from './storeContext';
import StoreReducer from './storeReducer';
import api from '../../api/api';
import { 
  GET_STORES, 
  CREATE_STORE, 
  GET_STORE, 
  DELETE_STORE, 
  UPDATE_STORE, 
  SET_ERROR,
  CLEAR_STATE,
  SET_LOADING,
  GET_STORES_BY_MAKE
 } from '../types';

const StoreState = props => {
  const initialState = {
    stores: [],
    store: {},
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(StoreReducer, initialState);

  //Get Stores
  const getStores = async () => {
    clearState();
    setLoading();
    try {
      const res = await api.get(`/stores?sort=make`);
      dispatch({ type: GET_STORES, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

   //Get Stores By Make
   const getStoresByMake = async (makeId) => {
    clearState();
    setLoading();
    try {
      const res = await api.get(`/makes/${makeId}/stores`);
      dispatch({ type: GET_STORES_BY_MAKE, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

   //Get Store
   const getStore = async (storeId) => {
    clearState();
    setLoading();
    try {
      const res = await api.get(`/stores/${storeId}`);
      dispatch({ type: GET_STORE, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})
    }
  };

  //Create Store
  const createStore = async (store) => {

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    clearState();
    setLoading();
    try {
      const res = await api.post(`makes/${store.make}/stores`, { ...store }, config);
      dispatch({ type: CREATE_STORE, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  }

   //Delete Store
   const deleteStore = async (storeId) => {
    const config =  {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    clearState();
    setLoading();
    try {
      
      const res = await api.delete(`/stores/${storeId}`, config);
      dispatch({ type: DELETE_STORE, payload: res.data.data })
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Update Store
  const updateStore = async (store, storeId) => {
    const config =  {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    setLoading();
    try {
      const res = await api.put(`/stores/${storeId}`, {...store} ,config);
      dispatch({ type: UPDATE_STORE, payload: res.data.data })
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Clear State
  const clearState = () => dispatch({ type: CLEAR_STATE });

  //Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <StoreContext.Provider
      value={{
        loading: state.loading,
        stores: state.stores,
        store: state.store,
        error: state.error,
        getStores,
        getStore,
        createStore,
        deleteStore,
        updateStore,
        clearState,
        setLoading,
        getStoresByMake
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreState;
