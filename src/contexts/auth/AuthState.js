import React, { useReducer } from 'react';
import AuthContext from './authContext';
import AuthReducer from './authReducer';
import api from '../../api/api';
import {
  REGISTER_SUCCESS,
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGOUT,
  LOGIN_FAIL,
  REGISTER_FAIL,
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  RESET_PASSWORD_FAIL,
  SET_ERROR,
  UPDATE_PROFILE,
  UPDATE_PASSWORD,
  SET_LOADING,
  CLEAR_STATE
} from '../types';

const AuthState = props => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    user: {},
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const clearState = () => dispatch({ type: CLEAR_STATE });


  const register = async values => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await api.post('/auth/register', values, config);
      dispatch({ type: REGISTER_SUCCESS, payload: res.data });

      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data
      });
    }
  };

  //Set Current User
  const loadUser = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };

    try {
      const res = await api.get(`/auth/me`, config);
      dispatch({
        type: USER_LOADED,
        payload: res.data.data
      });
    } catch (err) {
      dispatch({ type: LOGIN_FAIL, payload: err.response.data });
    }
  };

  //Login User
  const login = async values => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    setLoading();

    try {
      const res = await api.post('/auth/login', values, config);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data
      });
    }
  };

  //Update profile
  const updateProfile = async (values, type) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    setLoading();

    let res;
    try {
      if (type === 'photo') {
        const uploadConfig = await api.post(
          '/uploads/image',
          { type: values.type, fileName: values.name },
          config
        );

        await api.put(uploadConfig.data.url, values, {
          headers: {
            headers: { 'Content-Type': values ? values.type : null }
          }
        });

        const dataKey = uploadConfig.data.key;

        res = await api.put(`/auth/updatedetails`, { image: dataKey }, config);
      } else {
        res = await api.put('/auth/updatedetails', values, config);
      }

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: SET_ERROR,
        payload: err.response.data
      });
    }
  };

  // Logout
  const logout = () => dispatch({ type: LOGOUT });

  //Forgot Password
  const forgotPassword = async email => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await api.post('/auth/forgotpassword', { ...email }, config);
      dispatch({ type: FORGOT_PASSWORD, payload: res.data });
    } catch (err) {
      dispatch({ type: FORGOT_PASSWORD_FAIL, payload: err.response.data });
    }
  };

  //updatePassword
  const updatePassword = async values => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    setLoading();

    try {
      const res = await api.put('/auth/updatepassword', { ...values }, config);
      dispatch({ type: UPDATE_PASSWORD, payload: res.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };

  //Reset Password
  const resetPassword = async values => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await api.put(
        `/auth/resetPassword/${values.token}/`,
        { password: values.password },
        config
      );
      dispatch({ type: RESET_PASSWORD, payload: res.data });
    } catch (err) {
      dispatch({ type: RESET_PASSWORD_FAIL, payload: err.response.data });
    }
  };

  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        loading: state.loading,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        error: state.error,
        register,
        login,
        loadUser,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        updatePassword,
        clearState
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
