import { 
    GET_QUESTLEADS, 
    GET_QUESTLEAD, 
    UPDATE_QUESTLEAD, 
    DELETE_QUESTLEAD, 
    CREATE_QUESTLEAD, 
    SET_ERROR, 
    GET_QUESTLEADS_CHART, 
    GET_QUESTLEADS_BY_STATUS,
    CLEAR_STATE,
    SET_LOADING,
    GET_QUESTLEADS_BY_STORE,
    GET_ALL_CHART_QUESTLEADS,
    GET_QUESTLEADS_BY_USER,
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
      case GET_ALL_CHART_QUESTLEADS:
        return{
          ...state,
          chart: action.payload,
          count: action.count,
          loading: false,
          error: null
        }
      case GET_CHART:
      case GET_QUESTLEADS:
        return {
          ...state,
          questLeads: action.payload,
          count: action.count,
          loading: false,
          error: null
        };
      case GET_QUESTLEAD:
        return {
          ...state,
          questLead: action.payload,
          loading: false,
          error: null
        };
  
      case GET_QUESTLEADS_BY_USER:
        return {
          ...state,
          questLeads: action.payload,
          loading: false, 
          error: null
        }
      case UPDATE_QUESTLEAD:
        return {
          ...state,
          questLead: action.payload,
          loading: false,
          error: null
        };
      
      case DELETE_QUESTLEAD:
        return {
          ...state,
          questLead: null,
          loading: false,
          error: null
        };
      case CREATE_QUESTLEAD:
        return {
          ...state,
          loading: false,
          error: null
        };
      case GET_QUESTLEADS_CHART:
        return{
          ...state,
          questLeads: action.payload,
          loading: false,
          error: null
        }
      case GET_QUESTLEADS_BY_STATUS:
        return{
          ...state,
          questLeads: action.payload,
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
        questLead: {},
        questLeads: [],
        chart: [],
        loading: false,
        error: null
      }
    case SET_LOADING:
      return {
        ...state,
        loading: true
        }
    case GET_QUESTLEADS_BY_STORE:
      return {
        ...state,
        loading: false,
        error: null,
        questLead: action.payload,
        count: action.count
      }
      default:
        return state;
    }
  };
  