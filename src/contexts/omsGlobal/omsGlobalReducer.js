import { 
  GET_OMSGLOBALS, 
  GET_OMSGLOBAL, 
  UPDATE_OMSGLOBAL, 
  DELETE_OMSGLOBAL, 
  CREATE_OMSGLOBAL, 
  SET_ERROR, 
  GET_OMSGLOBALS_CHART, 
  GET_OMSGLOBALS_BY_STATUS,
  CLEAR_STATE,
  SET_LOADING,
  GET_OMSGLOBALS_BY_STORE,
  GET_ALL_CHART_OMSGLOBALS,
  GET_OMSGLOBALS_BY_USER,
  SET_VALUE,
  GET_CHART,
  CALL_USER
 } from '../types';

export default (state, action) => {
  switch (action.type) {
    case CALL_USER:
      return {
        ...state,
        loading: false,
        callToken: action.payload,
        error: null
      }
    case SET_VALUE:
      return {
        ...state,
        loading: false,
        value: action.payload,
        error: null
      }
    case GET_ALL_CHART_OMSGLOBALS:
      return{
        ...state,
        chart: action.payload,
        count: action.count,
        loading: false,
        error: null
      }
    case GET_CHART:
    case GET_OMSGLOBALS:
      return {
        ...state,
        omsGlobals: action.payload,
        count: action.count,
        loading: false,
        error: null
      };
    case GET_OMSGLOBAL:
      return {
        ...state,
        omsGlobal: action.payload,
        loading: false,
        error: null
      };

    case GET_OMSGLOBALS_BY_USER:
      return {
        ...state,
        omsGlobals: action.payload,
        loading: false, 
        error: null
      }
    case UPDATE_OMSGLOBAL:
      return {
        ...state,
        omsGlobal: action.payload,
        loading: false,
        error: null
      };
    
    case DELETE_OMSGLOBAL:
      return {
        ...state,
        omsGlobal: null,
        loading: false,
        error: null
      };
    case CREATE_OMSGLOBAL:
      return {
        ...state,
        loading: false,
        error: null
      };
    case GET_OMSGLOBALS_CHART:
      return{
        ...state,
        omsGlobals: action.payload,
        loading: false,
        error: null
      }
    case GET_OMSGLOBALS_BY_STATUS:
      return{
        ...state,
        omsGlobals: action.payload,
        loading: false,
        error: null,
        count: action.count,

      }
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
  case CLEAR_STATE:
    return {
      omsGlobal: {},
      omsGlobals: [],
      chart: [],
      loading: false,
      error: null
    }
  case SET_LOADING:
    return {
      ...state,
      loading: true
      }
  case GET_OMSGLOBALS_BY_STORE:
    return {
      ...state,
      loading: false,
      error: null,
      omsGlobal: action.payload,
      count: action.count
    }
    default:
      return state;
  }
};
