import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD,
  UPDATE_PROFILE,
  UPDATE_PASSWORD,
  SET_ERROR,
  SET_LOADING,
  CLEAR_STATE
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case CLEAR_STATE: 
    return {
      ...state,
      loading: false,
      error: null,
      user: null,
      isAuthenticated: false
    }
    case SET_LOADING:
      return {
        ...state,
        loading: true
      }
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
        error: null
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case UPDATE_PASSWORD:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case RESET_PASSWORD_FAIL:
    case FORGOT_PASSWORD_FAIL:
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case FORGOT_PASSWORD:
      return {
        ...state,
        loading: false,
        error: null
      };
    case RESET_PASSWORD:
      return {
        ...state,
        loading: false,
        error: null
      };
    case UPDATE_PROFILE:
      return{
        ...state,
        loading: false,
        error: null,
        user: action.payload
      };
    default:
      return state;
  }
};
