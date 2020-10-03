import { 
  GET_LEADS, 
  GET_LEAD, 
  UPDATE_LEAD, 
  DELETE_LEAD, 
  CREATE_LEAD, 
  SET_ERROR, 
  GET_LEADS_CHART, 
  GET_LEADS_BY_STATUS,
  CLEAR_STATE,
  SET_LOADING,
  GET_LEADS_BY_STORE,
  GET_LEADS_NEW,
  GET_LEADS_FOLLOW,
  GET_LEADS_SOLD,
  GET_LEADS_DATE,
  GET_LAST_LEADS,
  GET_ALL_CHART_LEADS,
  GET_LEADS_BY_USER,
  GET_ANALYTICS,
  GET_ANALYTICS_METRICS,
  CLEAR_METRICS

 } from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_ANALYTICS:
      return {
        ...state,
        lading: false,
        analytics: action.payload,
        labels: action.cuenta
      };
    case GET_ANALYTICS_METRICS:
      return {
        ...state,
        loading: false,
        metrics: action.payload
      };
    case GET_ALL_CHART_LEADS:
    case GET_LEADS:
      return {
        ...state,
        leads: action.payload,
        loading: false,
        error: null
      };
    case GET_LEADS_NEW:
      return {
        ...state,
        newS: action.payload.count,
        loading: false,
        error: null
      }
    case GET_LEADS_FOLLOW:
      return {
        ...state,
        follow: action.payload.count,
        loading: false,
        error: null
      }
    case GET_LEADS_SOLD:
      return {
        ...state,
        sold: action.payload.count,
        loading: false,
        error: null
      }
    case GET_LEADS_DATE:
    return {
      ...state,
      date: action.payload.count,
      loading: false,
      error: null
    }
    case GET_LAST_LEADS: 
    return {
      ...state,
      lastLeads: action.payload,
      loading: false,
      error: null
    }
    case GET_LEAD:
      return {
        ...state,
        lead: action.payload,
        loading: false,
        error: null
      };

    case GET_LEADS_BY_USER:
      return {
        ...state,
        leads: action.payload,
        loading: false, 
        error: null
      }
    case UPDATE_LEAD:
      return {
        ...state,
        lead: action.payload,
        loading: false,
        error: null
      };
    
    case DELETE_LEAD:
      return {
        ...state,
        lead: null,
        loading: false,
        error: null
      };
    case CREATE_LEAD:
      return {
        ...state,
        leads: [action.payload, ...state.leads],
        loading: false,
        error: null
      };
    case GET_LEADS_CHART:
      return{
        ...state,
        leads: action.payload,
        loading: false,
        error: null
      }
    case GET_LEADS_BY_STATUS:
      return{
        ...state,
        leads: action.payload,
        loading: false,
        error: null
      }
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
  case CLEAR_METRICS:
    return{
      ...state,
      metrics: null,

    }
  case CLEAR_STATE:
    return {
      lead: {},
      leads: [],
      loading: false,
      error: null
    }
  case SET_LOADING:
    return {
      ...state,
      loading: true
      }
  case GET_LEADS_BY_STORE:
    return {
      ...state,
      loading: false,
      error: null,
      leads: action.payload
    }
    default:
      return state;
  }
};
