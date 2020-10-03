import React, { useReducer } from 'react';
import UserContext from './userContext';
import UserReducer from './userReducer';
import api from '../../api/api';
import { 
  GET_USERS, 
  GET_USER, 
  UPDATE_USER, 
  DELETE_USER, 
  CREATE_USER, 
  SET_ERROR,
  CLEAR_STATE,
  SET_LOADING,
  GET_USERS_BY_STORE
 } from '../types';

const UserState = props => {
  const initialState = {
    users: [],
    user: {},
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(UserReducer, initialState);

  //Get Users
  const getUsers = async () => {
    clearState();
    setLoading();
    try {
      const res = await api.get(`/users`);
      dispatch({ type: GET_USERS, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Get Users By Store
  const getUsersByStore = async (storeId) => {
    clearState();
    setLoading();
    try {
      const res = await api.get(`stores/${storeId}/users`);
      dispatch({ type: GET_USERS_BY_STORE, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Get Single Item by ID
  const getUser = async userId => {
    clearState();
    setLoading();
    try {
      const res = await api.get(`/users/${userId}`);
      dispatch({
        type: GET_USER,
        payload: res.data.data
      });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Update User
  const updateUserRole = async (user) => {

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    clearState();
    setLoading();
    try{

      const res = await api.put(`/users/${user.id}`,{ role: user.role }, config);
      dispatch({ type: UPDATE_USER, payload: res.data.data });
      
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Delete User
  const deleteUser = async (userId) => {
    const config =  {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    clearState();
    setLoading();
    try {
      
      const res = await api.delete(`/users/${userId}`, config);
      dispatch({ type: DELETE_USER, payload: res.data.data })
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Create User
  const createUser = async (user) => {

    if(user.role === null){
      delete user.role;
    }
    
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    clearState();
    setLoading();
    try {
      const res = await api.post(`/users`, { ...user }, config);
      dispatch({ type: CREATE_USER, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  }

  //Update User
  const updateUser = async (user, userId) => {
    const config =  {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    clearState();
    setLoading();
    try {
      
      const res = await api.put(`/users/${userId}`, {...user} ,config);
      dispatch({ type: UPDATE_USER, payload: res.data.data })
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Clear State
  const clearState = () => dispatch({ type: CLEAR_STATE });

  //Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <UserContext.Provider
      value={{
        loading: state.loading,
        users: state.users,
        user: state.user,
        error: state.error,
        getUsers,
        getUser,
        updateUserRole,
        deleteUser,
        createUser,
        updateUser,
        clearState,
        setLoading,
        getUsersByStore
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
